"""
Import car parts into the Carlink Supabase project.

Only models from 2020 onward are imported (year_from >= 2020). Part names are
cleaned of the trailing model/year tail, and no source attribution is stored.

Usage:
    # Required env vars:
    #   SUPABASE_URL          e.g. https://xxx.supabase.co
    #   SUPABASE_SERVICE_KEY  service-role key (needed for storage uploads)

    python scripts/scrape_autopia.py --brand BMW --limit 5 --dry-run
    python scripts/scrape_autopia.py --brand BMW
    python scripts/scrape_autopia.py            # all configured brands
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import threading
import time
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
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

# Numeric "mark" IDs used in the source URLs, mapped to our brand labels.
BRAND_MARKS = {
    "BMW":      3,
    "Mercedes": 4,
    "Toyota":   6,
    "Hyundai":  9,
    "Subaru":   10,
    "Kia":      15,
}

MIN_YEAR = 2020              # only import models from this year onward
REQUEST_DELAY_SEC = 0.3      # politeness delay for listing/model page fetches
UPLOAD_WORKERS = 8           # concurrent image download + upload + upsert
USER_AGENT = "Mozilla/5.0 (compatible; CarlinkPartsBot/1.0)"
STORAGE_BUCKET = "part-images"

# Brand prefixes to strip from model names so the model dropdown stays clean.
BRAND_PREFIX_RE = {
    "BMW":      re.compile(r"^BMW\s*", re.I),
    "Mercedes": re.compile(r"^MERCEDES(?:-BENZ)?\s*", re.I),
    "Toyota":   re.compile(r"^TOYOTA\s*", re.I),
    "Hyundai":  re.compile(r"^HYUNDAI\s*", re.I),
    "Subaru":   re.compile(r"^SUBARU\s*", re.I),
    "Kia":      re.compile(r"^KIA\s*", re.I),
}

YEAR_RANGE_RE = re.compile(r"(\d{4})\s*-\s*(\d{4})?\s*$")
SINGLE_YEAR_RE = re.compile(r"(\d{4})\s*$")

session = requests.Session()
session.headers.update({"User-Agent": USER_AGENT})

_log_lock = threading.Lock()
_counter_lock = threading.Lock()


def log(msg: str) -> None:
    with _log_lock:
        print(msg, flush=True)


@dataclass
class Part:
    external_id: str
    name: str
    brand: str
    category: Optional[str]
    model: Optional[str]
    price_gel: Optional[float]
    image_url: Optional[str]
    in_stock: bool


# ---------------------------------------------------------------------------
# HTTP helpers
# ---------------------------------------------------------------------------

def fetch_html(url: str) -> str:
    time.sleep(REQUEST_DELAY_SEC)
    resp = session.get(url, timeout=(10, 30))
    resp.raise_for_status()
    return resp.text


def fetch_bytes(url: str) -> tuple[bytes, str]:
    # Module-level requests (fresh connection) — safe to call from many
    # worker threads at once, unlike a shared Session.
    resp = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=(10, 30))
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")


# ---------------------------------------------------------------------------
# Parsing
# ---------------------------------------------------------------------------

def parse_year_range(model: str) -> tuple[Optional[int], Optional[int]]:
    """Return (year_from, year_to) parsed from a model label. year_to is None
    for open-ended ('2020-') ranges."""
    m = YEAR_RANGE_RE.search(model)
    if m:
        year_from = int(m.group(1))
        year_to = int(m.group(2)) if m.group(2) else None
        return year_from, year_to
    m = SINGLE_YEAR_RE.search(model)
    if m:
        year = int(m.group(1))
        return year, year
    return None, None


def clean_part_name(name: str, brand: str) -> str:
    """Strip the trailing '- BRAND MODEL YEAR' tail that the source appends to
    every part name, leaving just the human-readable part description."""
    if not name:
        return name

    idx = name.lower().find(brand.lower())
    # Mercedes parts spell the brand out as "MERCEDES-BENZ" / "MERCEDES"
    if idx < 0 and brand == "Mercedes":
        idx = name.lower().find("mercedes")
    if idx > 0:
        name = name[:idx]
    else:
        # Fallback: cut a trailing block that contains a 4-digit year.
        name = re.sub(r"\s*[-–]\s*[^-–]*\d{4}.*$", "", name)

    name = re.sub(r"[\s\-–/]+$", "", name)        # trailing separators
    name = re.sub(r"\s*\b\d{4}\s*-?\s*$", "", name)    # dangling trailing year
    name = re.sub(r"[\s\-–/]+$", "", name)
    name = re.sub(r"\s+", " ", name).strip()
    return name


def parse_brand_models(html: str, mark: int) -> list[str]:
    """From a brand page, return the list of model labels."""
    soup = BeautifulSoup(html, "html.parser")
    out: list[str] = []
    seen: set[str] = set()
    needle = f"mark={mark}&model="
    for a in soup.select(f'a[href*="{needle}"]'):
        href = a.get("href", "")
        if href in seen:
            continue
        title = (a.get("title") or a.get_text(strip=True)).strip()
        if not title or len(title) > 80:
            continue
        seen.add(href)
        out.append((title, urllib.parse.urljoin(BASE_URL, href)))
    return out


def parse_product_listing(html: str, brand: str, model_name: str) -> list[Part]:
    """Extract individual products from a model listing page.

    Products carry their fields as data-* attributes on an addToCart button.
    Buttons are rendered twice (visible + hidden list) so we dedupe by code.
    """
    soup = BeautifulSoup(html, "html.parser")
    parts: list[Part] = []
    seen: set[str] = set()

    for btn in soup.select("button.addToCart[data-code]"):
        product_id = (btn.get("data-code") or "").strip()
        if not product_id or product_id in seen:
            continue
        raw_name = (btn.get("data-name") or "").strip()
        if not raw_name:
            continue
        seen.add(product_id)

        price_attr = (btn.get("data-price") or "").strip()
        try:
            price = float(price_attr) if price_attr else None
        except ValueError:
            price = None

        img_attr = (btn.get("data-img") or "").strip()
        image_url = urllib.parse.urljoin(BASE_URL, img_attr) if img_attr else None

        storage_attr = (btn.get("data-storage") or "0").strip()
        in_stock = storage_attr not in ("", "0")

        parts.append(Part(
            external_id=f"{brand.lower()}-{product_id}",
            name=clean_part_name(raw_name, brand),
            brand=brand,
            category=None,
            model=model_name,
            price_gel=price,
            image_url=image_url,
            in_stock=in_stock,
        ))

    return parts


# ---------------------------------------------------------------------------
# Supabase upload
# ---------------------------------------------------------------------------

def supabase_upload_image(supabase_url: str, service_key: str, image_bytes: bytes,
                          content_type: str, external_id: str) -> str:
    ext = content_type.split("/")[-1].split(";")[0].strip() or "jpg"
    if ext == "jpeg":
        ext = "jpg"
    safe_id = re.sub(r"[^a-zA-Z0-9._-]", "-", external_id)
    path = f"{safe_id}.{ext}"
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
        "source_url": "",
        "description": None,
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

def collect_brand_parts(brand: str, mark: int, limit: int) -> list[Part]:
    """Brand page -> 2020+ models -> products per model."""
    brand_url = f"{BASE_URL}/ka/products?mark={mark}"
    log(f"[{brand}] fetching brand page")
    brand_html = fetch_html(brand_url)
    models = parse_brand_models(brand_html, mark)

    recent = []
    for model_name, model_url in models:
        year_from, _ = parse_year_range(model_name)
        if year_from is not None and year_from >= MIN_YEAR:
            recent.append((model_name, model_url))
    log(f"[{brand}] {len(recent)}/{len(models)} models are {MIN_YEAR}+")

    collected: list[Part] = []
    for model_name, model_url in recent:
        if len(collected) >= limit:
            break
        try:
            model_html = fetch_html(model_url)
        except Exception as exc:
            log(f"  ! model fetch failed ({model_name}): {exc}")
            continue
        model_parts = parse_product_listing(model_html, brand, model_name)
        log(f"[{brand}] {model_name}: {len(model_parts)} parts")
        for part in model_parts:
            if len(collected) >= limit:
                break
            collected.append(part)
    return collected


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--brand", help="Single brand to import (default: all configured).")
    ap.add_argument("--limit", type=int, default=1_000_000,
                    help="Max parts per brand (default: no practical limit).")
    ap.add_argument("--dry-run", action="store_true",
                    help="Parse only; do not upload anything.")
    args = ap.parse_args()

    supabase_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
    service_key = os.environ.get("SUPABASE_SERVICE_KEY", "")
    if not args.dry_run and (not supabase_url or not service_key):
        log("error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set (or use --dry-run)")
        return 2

    if args.brand and args.brand not in BRAND_MARKS:
        log(f"error: unknown brand '{args.brand}'. Known: {', '.join(BRAND_MARKS)}")
        return 2
    brands = {args.brand: BRAND_MARKS[args.brand]} if args.brand else BRAND_MARKS

    # 1) Collect every part (sequential, polite).
    all_parts: list[Part] = []
    for brand, mark in brands.items():
        try:
            all_parts.extend(collect_brand_parts(brand, mark, args.limit))
        except Exception as exc:
            log(f"[{brand}] FAILED: {exc}")
    log(f"collected {len(all_parts)} parts total")

    if args.dry_run:
        for part in all_parts:
            log(json.dumps(asdict(part), ensure_ascii=False))
        log(f"dry-run complete. {len(all_parts)} parts parsed.")
        return 0

    # 2) Upload images + upsert rows concurrently.
    done = {"n": 0, "ok": 0, "fail": 0}
    total = len(all_parts)

    def process(part: Part) -> None:
        try:
            if part.image_url:
                try:
                    img_bytes, ctype = fetch_bytes(part.image_url)
                    part.image_url = supabase_upload_image(
                        supabase_url, service_key, img_bytes, ctype, part.external_id)
                except Exception as exc:
                    log(f"  ! image failed {part.external_id}: {exc}")
                    part.image_url = None
            supabase_upsert_part(supabase_url, service_key, part)
            with _counter_lock:
                done["ok"] += 1
        except Exception as exc:
            with _counter_lock:
                done["fail"] += 1
            log(f"  ! upsert failed {part.external_id}: {exc}")
        finally:
            with _counter_lock:
                done["n"] += 1
                n, ok, fail = done["n"], done["ok"], done["fail"]
            if n % 50 == 0 or n == total:
                log(f"  ... {n}/{total} (ok={ok} fail={fail})")

    with ThreadPoolExecutor(max_workers=UPLOAD_WORKERS) as pool:
        futures = [pool.submit(process, p) for p in all_parts]
        for _ in as_completed(futures):
            pass

    log(f"done. {done['ok']} parts upserted, {done['fail']} failed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
