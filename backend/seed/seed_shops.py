import asyncio
import random
import uuid

from geoalchemy2 import WKTElement
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import async_session, engine
from app.models.category import Category
from app.models.shop import Shop

ADDIS_NEIGHBORHOODS = [
    ("Bole", 9.0108, 38.7663),
    ("Kazanchis", 9.0222, 38.7469),
    ("CMC", 9.0200, 38.7900),
    ("Piassa", 9.0400, 38.7500),
    ("Megenagna", 9.0300, 38.7700),
    ("Merkato", 9.0350, 38.7450),
    ("Summit", 9.0550, 38.7800),
    ("Ayat", 8.9800, 38.8000),
    ("Gurd Shola", 9.0200, 38.7600),
    ("Bole Medhanealem", 9.0000, 38.7750),
    ("Jemo", 8.9700, 38.7350),
    ("Nifas Silk", 8.9600, 38.7400),
    ("Saris", 8.9900, 38.7250),
    ("Mexico", 9.0250, 38.7300),
    ("Arat Kilo", 9.0450, 38.7600),
    ("Siddist Kilo", 9.0600, 38.7600),
    ("Lideta", 9.0150, 38.7350),
    ("Gotera", 8.9800, 38.7150),
    ("Kality", 8.9200, 38.7100),
    ("Akaki", 8.8800, 38.7200),
    ("Gerji", 9.0000, 38.7900),
    ("Bisrate Gabriel", 9.0350, 38.7550),
    ("Atlas", 9.0050, 38.7700),
    ("Hayahulet", 9.0250, 38.7750),
    ("Wollo Sefer", 9.0150, 38.7500),
]

CATEGORIES = [
    {
        "name": "Grocery",
        "slug": "grocery",
        "icon": "shopping-cart",
        "shops": [
            "FreshMart",
            "Green Basket",
            "Daily Needs",
            "Corner Fresh",
            "Veggie Haven",
            "Family Grocers",
            "Fresh & Fast",
            "Bole Fresh",
            "City Greens",
            "Neighborhood Mart",
            "Fresh Pick",
            "Green Leaf",
            "Daily Fresh",
            "Mega Greens",
            "Quick Shop",
            "Fresh Choice",
            "Village Mart",
            "Basket Fresh",
            "Corner Store",
            "Green Basket",
        ],
    },
    {
        "name": "Cafe",
        "slug": "cafe",
        "icon": "coffee",
        "shops": [
            "Brew House",
            "Coffee Time",
            "Bean & Cup",
            "Cafe Vanilla",
            "Roast & Brew",
            "The Coffee Spot",
            "Espresso Lane",
            "Cafe Mocha",
            "Brew & Bean",
            "Morning Cup",
            "Cafe Latte",
            "The Roastery",
            "Coffee Lab",
            "Buna Cafe",
            "Cafe Caramel",
            "Grind & Brew",
            "Cafe Alto",
            "Brew Point",
            "Golden Bean",
            "Cafe Supreme",
        ],
    },
    {
        "name": "Pharmacy",
        "slug": "pharmacy",
        "icon": "pill",
        "shops": [
            "MedPlus",
            "Health First",
            "Care Pharmacy",
            "City Drug",
            "Pharma Care",
            "Wellness Plus",
            "MediSave",
            "Health Hub",
            "Pharma Link",
            "Care Plus",
            "MedWorld",
            "Life Pharmacy",
            "Health Point",
            "City Med",
            "Pharma Direct",
            "MediCare",
            "Health Plus",
            "Rx Pharmacy",
            "MedStore",
            "Vita Health",
        ],
    },
    {
        "name": "Restaurant",
        "slug": "restaurant",
        "icon": "utensils",
        "shops": [
            "UrbanBites",
            "Flavor Kitchen",
            "Taste of Addis",
            "Spice Garden",
            "The Hungry Spoon",
            "Savory Spot",
            "Bistro 42",
            "Mega Bites",
            "Herb & Grill",
            "Dine Fresh",
            "Golden Plate",
            "The Feast",
            "Cuisine House",
            "Zoma Bistro",
            "Habesha Kitchen",
            "Taste Buds",
            "Flame & Grill",
            "Fresh Plate",
            "Savory House",
            "Dine Spot",
        ],
    },
    {
        "name": "Bookstore",
        "slug": "bookstore",
        "icon": "book",
        "shops": [
            "PageTurner",
            "Book Haven",
            "Readers' Paradise",
            "The Book Nook",
            "Paper Trail",
            "Chapter One",
            "Book World",
            "Page & Ink",
            "The Reading Room",
            "Book Mark",
            "Literary Lane",
            "Book Stop",
            "Cover to Cover",
            "The Shelf",
            "Page One",
            "Bind & Leaf",
            "Book Bazaar",
            "The Library Spot",
            "Book Nest",
            "Reading Nook",
        ],
    },
    {
        "name": "Electronics",
        "slug": "electronics",
        "icon": "device-laptop",
        "shops": [
            "TechWorld",
            "Gadget Hub",
            "Digital Zone",
            "Electro Mart",
            "Tech Point",
            "Byte & Chip",
            "Smart Electronics",
            "Gadget World",
            "Digital Street",
            "Tech Hub",
            "Electro City",
            "GigaMart",
            "Tech Spot",
            "Innovate Tech",
            "Circuit House",
            "Digital Plus",
            "TechBite",
            "ElectroZone",
            "Smart Buy",
            "The Tech Shop",
        ],
    },
    {
        "name": "Clothing",
        "slug": "clothing",
        "icon": "shirt",
        "shops": [
            "StyleHub",
            "Fashion Street",
            "Trendy Wear",
            "Urban Threads",
            "Vogue Spot",
            "Chic Boutique",
            "Wardrobe",
            "Fashion First",
            "Style Point",
            "Trend House",
            "Moda Lane",
            "Dress Code",
            "Fabric & Form",
            "The Boutique",
            "Classic Threads",
            "Fashion Hub",
            "Style Studio",
            "TrendSet",
            "Urban Style",
            "Vogue Lane",
        ],
    },
    {
        "name": "Hardware",
        "slug": "hardware",
        "icon": "tools",
        "shops": [
            "BuildRight",
            "Tool Center",
            "Iron & Wood",
            "Hardware Hub",
            "Fix & Build",
            "Metal Mart",
            "Tool Box",
            "Build It",
            "Hardware Spot",
            "Nut & Bolt",
            "Construct Mart",
            "Tool Shed",
            "Build Wise",
            "Iron Gate",
            "Hardware Plus",
            "FixIt Shop",
            "Builders' Choice",
            "Tool World",
            "Construct Hub",
            "Hardware King",
        ],
    },
    {
        "name": "Supermarket",
        "slug": "supermarket",
        "icon": "building-store",
        "shops": [
            "MegaMart",
            "City Superstore",
            "Family Basket",
            "SuperSave",
            "One Stop Shop",
            "Big Basket",
            "Metro Mart",
            "Value Plus",
            "SuperWorld",
            "Grand Store",
            "City Mart",
            "Mega Basket",
            "Super Fresh",
            "Family Mart",
            "Global Superstore",
            "Smart Shop",
            "Prime Mart",
            "Super Deals",
            "Metro Superstore",
            "Elite Mart",
        ],
    },
]

PHONE_PREFIXES = ["91", "92", "93", "94", "95", "96", "97", "98", "99"]

CLOSING_TIMES = ["18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00"]


def random_phone():
    prefix = random.choice(PHONE_PREFIXES)
    suffix = "".join([str(random.randint(0, 9)) for _ in range(6)])
    return f"+251 {prefix} {suffix[:3]} {suffix[3:]}"


def random_location(neighborhood):
    name, base_lat, base_lon = neighborhood
    lat = base_lat + random.uniform(-0.008, 0.008)
    lon = base_lon + random.uniform(-0.008, 0.008)
    return lat, lon


async def seed_database():
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))

    async with async_session() as db:
        existing = await db.execute(select(Category))
        if existing.scalars().first():
            print("Database already seeded. Skipping.")
            return

        category_objects = []
        for cat_data in CATEGORIES:
            cat = Category(
                name=cat_data["name"], slug=cat_data["slug"], icon=cat_data["icon"]
            )
            db.add(cat)
            category_objects.append(cat)
        await db.commit()
        for cat in category_objects:
            await db.refresh(cat)

        shop_count = 0
        for cat_obj, cat_data in zip(category_objects, CATEGORIES):
            names = cat_data["shops"]
            shops_per_category = 5000 // len(CATEGORIES)
            extra = 5000 % len(CATEGORIES)
            count = shops_per_category + (1 if cat_data == CATEGORIES[-1] else 0)

            for i in range(count):
                base_name = random.choice(names)
                suffix = random.choice(
                    ["", f" {i + 1}", f" {uuid.uuid4().hex[:4].upper()}"]
                )
                name = f"{base_name}{suffix}"

                neighborhood = random.choice(ADDIS_NEIGHBORHOODS)
                lat, lon = random_location(neighborhood)
                neighborhood_name = neighborhood[0]

                wkt_point = WKTElement(f"POINT({lon} {lat})", srid=4326)
                rating = round(random.uniform(3.0, 5.0), 1)
                review_count = random.randint(0, 200)
                is_open = random.random() < 0.85
                closing_time = random.choice(CLOSING_TIMES) if is_open else None
                phone = random_phone()
                address = f"{random.randint(1, 999)} {neighborhood_name}, Addis Ababa"

                shop = Shop(
                    name=name,
                    category_id=cat_obj.id,
                    latitude=lat,
                    longitude=lon,
                    location=wkt_point,
                    address=address,
                    phone=phone,
                    rating=rating,
                    review_count=review_count,
                    is_open=is_open,
                    closing_time=closing_time,
                )
                db.add(shop)
                shop_count += 1

                if shop_count % 500 == 0:
                    await db.commit()
                    print(f"  Seeded {shop_count} shops...")

        await db.commit()
        print(
            f"Done! Seeded {len(category_objects)} categories and {shop_count} shops."
        )


async def main():
    print("Seeding NearShop database...")
    await seed_database()


if __name__ == "__main__":
    asyncio.run(main())
