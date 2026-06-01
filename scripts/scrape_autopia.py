"""
Scrape car parts from autopia.ge and upsert them into the Carlink Supabase project.

Usage:
    # Required env vars:
    #   SUPABASE_URL          e.g. https://xxx.supabase.co
    #   SUPABASE_SERVICE_KEY  service-role key (NOT the anon key) — needed for storage uploads

    python scripts/scrape_autopia.py --brand BMW --limit 5 --dry-run
    python scripts/scrape_autopia.py --brand BMW --limit 5
    python scripts/scrape_autopia.py            # all configured brands

Politeness:
    - 1s sleep between requests
    - identifying User-Agent
    - hard cap per brand to avoid runaway crawls

The selectors in PARSE_LISTING / PARSE_DETAIL are best-effort and will likely
need to be tweaked after a manual look at autopia.ge's HTML. Search for the
"TODO: adjust selectors" markers below.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.parse
import uuid
from dataclasses import dataclass, asdict
from typing import Optional

import requests
from bs4 import BeautifulSoup

# Ensure Georgian text prints cleanly on Windows consoles
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        try:
            stream.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

BASE_URL = "https://www.autopia.ge"

# autopia.ge uses numeric "mark" IDs in the URL, not brand names.
BRAND_MARKS = {
    "BMW":      3,
    "Mercedes": 4,
    "Toyota":   6,
    "Hyundai":  9,
    "Subaru":   10,
    "Kia":      15,
    "Lexus":    20,
}
BRAND_URLS = {
    brand: f"{BASE_URL}/ka/products?mark={mark}"
    for brand, mark in BRAND_MARKS.items()
}

HARD_CAP_PER_BRAND = 200
REQUEST_DELAY_SEC = 1.0
USER_AGENT = "CarlinkPartsBot/1.0 (+contact: info@carlink.ge)"
STORAGE_BUCKET = "part-images"

session = requests.Session()
session.headers.update({"User-Agent": USER_AGENT})


@dataclass
class Part:
    external_id: str
    name: str
    brand: str
    category: Optional[str]
    model: Optional[str]
    price_gel: Optional[float]
    image_url: Optional[str]     # remote (autopia) URL — replaced by Supabase URL after upload
    source_url: str
    description: Optional[str]
    in_stock: bool


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def fetch_html(url: str) -> str:
    time.sleep(REQUEST_DELAY_SEC)
    resp = session.get(url, timeout=30)
    resp.raise_for_status()
    return resp.text


def fetch_bytes(url: str) -> tuple[bytes, str]:
    time.sleep(REQUEST_DELAY_SEC)
    resp = session.get(url, timeout=30)
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------------------------------------------------------------------
# Parsing (TODO: adjust selectors)
# ---------------------------------------------------------------------------

def parse_brand_models(html: str, mark: int) -> list[tuple[str, str]]:
    """From a /ka/products?mark=X page, return [(model_name, model_url), ...]."""
    soup = BeautifulSoup(html, "html.parser")
    out: list[tuple[str, str]] = []
    seen: set[str] = set()
    needle = f"mark={mark}&model="
    for a in soup.select(f'a[href*="{needle}"]'):
        href = a.get("href", "")
        if href in seen:
            continue
        title = (a.get("title") or a.get_text(strip=True)).strip()
        if not title or len(title) > 80:  # skip "view products" buttons
            continue
        seen.add(href)
        out.append((title, urllib.parse.urljoin(BASE_URL, href)))
    return out


def parse_product_listing(html: str, brand: str, model_name: str) -> list[Part]:
    """Extract individual product items from a /ka/products?mark=X&model=Y page.

    Real products are rendered with an addToCart button carrying all the
    fields we need as data-* attributes:
        <button class="addToCart"
                data-id="17437"
                data-name="..."
                data-code="BM1203010"
                data-price="178"
                data-img="/assets/images/products/...jpg">
    We anchor on this button (it does not appear on model-browser cards),
    which makes the parse robust against the "newly added" carousel that
    autopia renders on every page.
    """
    soup = BeautifulSoup(html, "html.parser")
    parts: list[Part] = []
    seen: set[str] = set()

    for btn in soup.select("button.addToCart[data-code]"):
        product_id = (btn.get("data-code") or "").strip()
        if not product_id or product_id in seen:
            continue
        name = (btn.get("data-name") or "").strip()
        if not name:
            continue
        seen.add(product_id)

        price_attr = (btn.get("data-price") or "").strip()
        try:
            price = float(price_attr) if price_attr else None
        except ValueError:
            price = parse_price(price_attr)

        img_attr = (btn.get("data-img") or "").strip()
        image_url = urllib.parse.urljoin(BASE_URL, img_attr) if img_attr else None

        storage_attr = (btn.get("data-storage") or "0").strip()
        in_stock = storage_attr not in ("", "0")

        source_url = f"{BASE_URL}/ka/product/{product_id}"

        parts.append(Part(
            external_id=f"{brand.lower()}-{product_id}",
            name=name,
            brand=brand,
            category=None,
            model=model_name,
            price_gel=price,
            image_url=image_url,
            source_url=source_url,
            description=None,
            in_stock=in_stock,
        ))

    return parts


def enrich_from_detail(part: Part) -> None:
    """Visit the detail page and pull model + description. Best-effort.

    On autopia.ge the breadcrumb is:  Home > Brand > Model-Year > Part name.
    The model link uses ?mark=X&model=Y so it's easy to identify.
    """
    try:
        html = fetch_html(part.source_url)
    except Exception as exc:
        print(f"  ! detail fetch failed for {part.source_url}: {exc}", file=sys.stderr)
        return

    soup = BeautifulSoup(html, "html.parser")

    # Model: find breadcrumb anchor whose href contains ?mark=...&model=...
    model_link = soup.find("a", href=lambda h: bool(h and "model=" in h and "mark=" in h))
    if model_link:
        part.model = model_link.get_text(strip=True)

    # Description: try a few generic candidates. autopia's markup is minimal
    # so we cast a wide net and silently skip if nothing fits.
    for sel in (".product-description", ".description", "#description",
                ".product-info p", "main p"):
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 30:
            part.description = el.get_text(" ", strip=True)[:2000]
            break

    # Higher-res main image: the listing image already works; only override if
    # we find a larger gallery image.
    main_img = soup.select_one('img[src*="/assets/images/products/"]')
    if main_img and main_img.get("src"):
        part.image_url = urllib.parse.urljoin(BASE_URL, main_img["src"])


def parse_price(text: str) -> Optional[float]:
    if not text:
        return None
    digits = []
    seen_sep = False
    for ch in text:
        if ch.isdigit():
            digits.append(ch)
        elif ch in (".", ",") and not seen_sep:
            digits.append(".")
            seen_sep = True
    if not digits:
        return None
    try:
        return float("".join(digits))
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# Supabase upload
# ---------------------------------------------------------------------------

def supabase_upload_image(supabase_url: str, service_key: str, image_bytes: bytes,
                          content_type: str, external_id: str) -> str:
    ext = content_type.split("/")[-1].split(";")[0].strip() or "jpg"
    if ext == "jpeg":
        ext = "jpg"
    path = f"{external_id}.{ext}"
    url = f"{supabase_url}/storage/v1/object/{STORAGE_BUCKET}/{path}"
    resp = requests.post(url, data=image_bytes, headers={
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }, timeout=60)
    if not resp.ok:
        raise RuntimeError(f"image upload failed ({resp.status_code}): {resp.text[:200]}")
    return f"{supabase_url}/storage/v1/object/public/{STORAGE_BUCKET}/{path}"


def supabase_upsert_part(supabase_url: str, service_key: str, part: Part) -> None:
    url = f"{supabase_url}/rest/v1/car_parts?on_conflict=external_id"
    body = {
        "external_id": part.external_id,
        "name": part.name,
        "brand": part.brand,
        "category": part.category,
        "model": part.model,
        "price_gel": part.price_gel,
        "image_url": part.image_url,
        "source_url": part.source_url,
        "description": part.description,
        "in_stock": part.in_stock,
        "active": True,
    }
    resp = requests.post(url, data=json.dumps(body), headers={
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }, timeout=30)
    if not resp.ok:
        raise RuntimeError(f"upsert failed ({resp.status_code}): {resp.text[:200]}")


# ---------------------------------------------------------------------------
# Main driver
# ---------------------------------------------------------------------------

def scrape_brand(brand: str, mark: int, limit: int, enrich: bool) -> list[Part]:
    """Two-level scrape: brand → list of models → products per model."""
    brand_url = f"{BASE_URL}/ka/products?mark={mark}"
    print(f"[{brand}] fetching brand page {brand_url}")
    brand_html = fetch_html(brand_url)
    models = parse_brand_models(brand_html, mark)
    print(f"[{brand}] found {len(models)} models")

    collected: list[Part] = []
    for model_name, model_url in models:
        if len(collected) >= limit:
            break
        print(f"[{brand}] model: {model_name}  ({model_url})")
        try:
            model_html = fetch_html(model_url)
        except Exception as exc:
            print(f"  ! model fetch failed: {exc}", file=sys.stderr)
            continue
        model_parts = parse_product_listing(model_html, brand, model_name)
        print(f"    -> {len(model_parts)} products")
        for part in model_parts:
            if len(collected) >= limit:
                break
            collected.append(part)

    if enrich:
        for i, part in enumerate(collected, 1):
            print(f"[{brand}] enrich {i}/{len(collected)}  {part.name[:60]}")
            enrich_from_detail(part)
    return collected


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", help="Single brand to scrape (default: all configured).")
    ap.add_argument("--limit", type=int, default=HARD_CAP_PER_BRAND,
                    help=f"Max parts per brand (default {HARD_CAP_PER_BRAND}).")
    ap.add_argument("--dry-run", action="store_true",
                    help="Parse only; do not upload anything to Supabase.")
    ap.add_argument("--no-enrich", action="store_true",
                    help="Skip per-product detail page fetches.")
    args = ap.parse_args()

    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY", "")
    if not args.dry_run and (not supabase_url or not service_key):
        print("error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set (or use --dry-run)",
              file=sys.stderr)
        return 2

    if args.brand and args.brand not in BRAND_MARKS:
        print(f"error: unknown brand '{args.brand}'. Known: {', '.join(BRAND_MARKS)}",
              file=sys.stderr)
        return 2
    brands = {args.brand: BRAND_MARKS[args.brand]} if args.brand else BRAND_MARKS

    total = 0
    for brand, mark in brands.items():
        try:
            parts = scrape_brand(brand, mark, args.limit, enrich=not args.no_enrich)
        except Exception as exc:
            print(f"[{brand}] FAILED: {exc}", file=sys.stderr)
            continue

        for part in parts:
            if args.dry_run:
                print(json.dumps(asdict(part), ensure_ascii=False))
                continue
            try:
                if part.image_url:
                    img_bytes, ctype = fetch_bytes(part.image_url)
                    part.image_url = supabase_upload_image(
                        supabase_url, service_key, img_bytes, ctype, part.external_id)
                supabase_upsert_part(supabase_url, service_key, part)
                total += 1
            except Exception as exc:
                print(f"  ! upload failed for {part.external_id}: {exc}", file=sys.stderr)

    print(f"done. {total} parts upserted." if not args.dry_run
          else f"dry-run complete. {sum(len(BRAND_URLS) for _ in [0])} brand(s) processed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
