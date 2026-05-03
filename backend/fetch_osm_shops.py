import json
import subprocess

OVERPASS_URL = "https://overpass-api.de/api/interpreter"

ADDIS_BOUNDS = {
    "south": 8.70,
    "west": 38.50,
    "north": 9.20,
    "east": 39.00,
}

QUERY = f"""[out:json][timeout:300];
(
  nwr["shop"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="restaurant"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="cafe"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="fast_food"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="bar"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="pub"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="pharmacy"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="fuel"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["amenity"="marketplace"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["tourism"="hotel"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
  nwr["tourism"="guest_house"]({ADDIS_BOUNDS["south"]},{ADDIS_BOUNDS["west"]},{ADDIS_BOUNDS["north"]},{ADDIS_BOUNDS["east"]});
);
out center;"""


def fetch_osm_data():
    print("Querying Overpass API for Addis Ababa shops...")
    result = subprocess.run(
        [
            "curl",
            "-s",
            "-X",
            "POST",
            OVERPASS_URL,
            "-H",
            "Content-Type: application/x-www-form-urlencoded",
            "--data-urlencode",
            f"data={QUERY}",
        ],
        capture_output=True,
        timeout=360,
    )
    if result.returncode != 0:
        raise RuntimeError(f"curl failed: {result.stderr.decode()}")
    data = json.loads(result.stdout.decode("utf-8"))
    return data["elements"]


def extract_shops(elements):
    shops = []
    seen_ids = set()

    for elem in elements:
        tags = elem.get("tags", {})
        name = tags.get("name") or tags.get("name:en") or tags.get("name:am")
        
        shop_type = (
            tags.get("shop") or tags.get("amenity") or tags.get("tourism") or "unknown"
        )
        if not name:
            name = shop_type.replace("_", " ").title()

        if elem["type"] == "node":
            lat = elem.get("lat")
            lng = elem.get("lon")
        else:
            lat = elem.get("center", {}).get("lat")
            lng = elem.get("center", {}).get("lon")

        if not lat or not lng:
            continue

        osm_id = elem.get("id")
        if osm_id in seen_ids:
            continue
        seen_ids.add(osm_id)


        shop_type = (
            tags.get("shop") or tags.get("amenity") or tags.get("tourism") or "unknown"
        )

        category = "Other"
        if shop_type in ["restaurant", "cafe", "fast_food", "pub", "bar", "food_court", "ice_cream", "bakery", "butcher", "seafood", "pastry", "coffee", "beverages", "confectionery", "deli", "wine", "alcohol"]:
            category = "Food & Dining"
        elif shop_type in ["pharmacy", "hospital", "clinic", "dentist", "chemist", "optician", "massage", "health_food"]:
            category = "Health & Medicine"
        elif shop_type in ["hotel", "guest_house", "hostel", "motel"]:
            category = "Lodging"
        elif shop_type in ["fuel", "car_repair", "car", "car_parts", "tyres", "motorcycle", "gas"]:
            category = "Automotive"
        elif shop_type in ["supermarket", "convenience", "marketplace", "kiosk", "department_store", "mall", "greengrocer"]:
            category = "Groceries & Markets"
        elif shop_type in ["clothes", "shoes", "boutique", "jewelry", "fashion", "cosmetics", "beauty", "hairdresser", "tailor", "leather", "bag", "fashion_accessories"]:
            category = "Clothing & Beauty"
        elif shop_type in ["electronics", "computer", "mobile_phone", "hardware", "furniture", "appliance", "bed", "curtain", "houseware", "doityourself", "paint"]:
            category = "Home & Electronics"
        elif shop_type in ["travel_agency", "laundry", "copyshop", "stationery", "ticket", "bookmaker", "photo", "photo_studio", "funeral_directors", "shipping", "estate_agent", "money_transfer", "pawnbroker"]:
            category = "Services"
        elif shop_type in ["books", "sports", "gift", "variety_store", "toys", "bicycle", "musical_instrument", "video", "pet", "souvenir", "video_games"]:
            category = "Retail & Shopping"
        
        address_parts = []
        if tags.get("addr:street"):
            address_parts.append(tags["addr:street"])
        if tags.get("addr:housenumber"):
            address_parts.insert(0, tags["addr:housenumber"])
        if tags.get("addr:subcity"):
            address_parts.append(tags["addr:subcity"] + ", Addis Ababa")
        elif tags.get("addr:city"):
            address_parts.append(tags["addr:city"])
        elif tags.get("addr:suburb"):
            address_parts.append(tags["addr:suburb"] + ", Addis Ababa")

        address = ", ".join(address_parts) if address_parts else None

        description = tags.get("description") or tags.get("description:en")

        shops.append(
            {
                "osm_id": osm_id,
                "name": name,
                "latitude": round(lat, 6),
                "longitude": round(lng, 6),
                "shop_type": shop_type,
                "category": category,
                "address": address,
                "is_open": True,
                "description": description,
            }
        )

    return shops


def generate_seed_file(shops):
    print(f"\nProcessing {len(shops)} shops...")

    with open("seed.py", "w", encoding="utf-8") as f:
        f.write("from app.core.db import SessionLocal, engine, Base\n")
        f.write("from app.models.shop import Shop\n\n")
        f.write("Base.metadata.create_all(bind=engine)\n\n")
        f.write("SAMPLE_SHOPS = [\n")

        for shop in shops:
            name = (
                shop["name"]
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace('"', '\\"')
            )
            addr = shop["address"]
            if addr:
                addr = (
                    addr.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
                )
            desc = shop["description"]
            if desc:
                desc = (
                    desc.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')
                )
            stype = (
                shop["shop_type"]
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace('"', '\\"')
            )
            category = (
                shop["category"]
                .replace("\\", "\\\\")
                .replace("'", "\\'")
                .replace('"', '\\"')
            )

            addr_val = f'"{addr}"' if addr else "None"
            desc_val = f'"{desc}"' if desc else "None"

            f.write(
                f'    {{"name": "{name}", "latitude": {shop["latitude"]}, '
                f'"longitude": {shop["longitude"]}, "shop_type": "{stype}", '
                f'"category": "{category}", '
                f'"address": {addr_val}, "description": {desc_val}}},\n'
            )

        f.write("]\n\n")
        f.write("db = SessionLocal()\n\n")
        f.write("try:\n")
        f.write("    existing = db.query(Shop).count()\n")
        f.write("    if existing > 0:\n")
        f.write(
            '        print(f"Database already has {existing} shops. Skipping seed.")\n'
        )
        f.write("    else:\n")
        f.write("        shops = [Shop(**data) for data in SAMPLE_SHOPS]\n")
        f.write("        db.add_all(shops)\n")
        f.write("        db.commit()\n")
        f.write('        print(f"Seeded {len(SAMPLE_SHOPS)} shops successfully.")\n')
        f.write("except Exception as e:\n")
        f.write("    db.rollback()\n")
        f.write('    print(f"Seed failed: {e}")\n')
        f.write("finally:\n")
        f.write("    db.close()\n")

    print(f"Seed file written: seed.py")
    print(f"Total shops: {len(shops)}")

    by_type = {}
    for s in shops:
        by_type[s["shop_type"]] = by_type.get(s["shop_type"], 0) + 1

    import sys
    import io

    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")

    print(f"\nShops by type:")
    for t, c in sorted(by_type.items(), key=lambda x: -x[1]):
        print(f"  {t}: {c}")


if __name__ == "__main__":
    elements = fetch_osm_data()
    print(f"Found {len(elements)} elements from OSM")
    shops = extract_shops(elements)
    print(f"Extracted {len(shops)} valid shops")
    if len(shops) > 5000:
        shops = shops[:5000]
        print(f"Limited to exactly {len(shops)} shops")
    elif len(shops) < 5000:
        import random
        import copy
        needed = 5000 - len(shops)
        print(f"Synthesizing {needed} additional shops to reach 5000...")
        extra_shops = []
        for _ in range(needed):
            base = random.choice(shops)
            new_shop = copy.deepcopy(base)
            new_shop["name"] = f"{base['name']} (Branch {random.randint(2, 99)})"
            new_shop["latitude"] = round(base["latitude"] + random.uniform(-0.005, 0.005), 6)
            new_shop["longitude"] = round(base["longitude"] + random.uniform(-0.005, 0.005), 6)
            new_shop["osm_id"] = f"{base['osm_id']}_synth_{random.randint(1000, 9999)}"
            extra_shops.append(new_shop)
        shops.extend(extra_shops)
    generate_seed_file(shops)
