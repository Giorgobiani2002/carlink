import json
import urllib.request
import os

supabase_url = "https://rngrmemlqzcjfpcbyejr.supabase.co"
anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuZ3JtZW1scXpjamZwY2J5ZWpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDc2NjgsImV4cCI6MjA5NTE4MzY2OH0.OZ7IqEy1f1Kj_MXeSMEmLrXDwEnemK75Md4C7gGbpIc"
email = "admin@carlink.ge"
password = "carlink2026"
local_api = "http://localhost:3001/api/seed-tariffs"

def login():
    print(f"Logging in as {email}...")
    url = f"{supabase_url}/auth/v1/token?grant_type=password"
    data = json.dumps({"email": email, "password": password}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={
        "apikey": anon_key,
        "Content-Type": "application/json"
    })
    try:
        with urllib.request.urlopen(req) as res:
            resp = json.loads(res.read().decode())
            return resp["access_token"]
    except Exception as e:
        body = e.read().decode() if hasattr(e, "read") else str(e)
        print(f"Login failed: {body}")
        return None

def seed(token):
    print("Seeding tariffs via local API...")
    req = urllib.request.Request(local_api, data=b"", method="POST", headers={
        "Authorization": f"Bearer {token}"
    })
    try:
        with urllib.request.urlopen(req) as res:
            print("Success! Response:", res.read().decode())
    except Exception as e:
        body = e.read().decode() if hasattr(e, "read") else str(e)
        print(f"Seed failed: {body}")

token = login()
if token:
    seed(token)
