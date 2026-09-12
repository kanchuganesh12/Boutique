"""Seed MongoDB from data/catalog.json."""

from __future__ import annotations

import asyncio
import json
from datetime import datetime
from pathlib import Path

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import get_settings

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "catalog.json"


async def seed() -> None:
    settings = get_settings()
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db]

    with DATA_PATH.open(encoding="utf-8") as f:
        data = json.load(f)

    now = datetime.utcnow()
    products = []
    for p in data["products"]:
        doc = dict(p)
        doc.setdefault("pre_order", {"is_pre_order": False, "expected_date": None})
        doc["created_at"] = now
        products.append(doc)

    await db.categories.delete_many({})
    await db.collections.delete_many({})
    await db.products.delete_many({})
    await db.stores.delete_many({})
    await db.reviews.delete_many({})

    if data["categories"]:
        await db.categories.insert_many(data["categories"])
    if data["collections"]:
        await db.collections.insert_many(data["collections"])
    if products:
        await db.products.insert_many(products)
    if data["stores"]:
        await db.stores.insert_many(data["stores"])
    if data["reviews"]:
        await db.reviews.insert_many(data["reviews"])

    await db.products.create_index("slug", unique=True)
    await db.products.create_index("sku", unique=True)
    await db.products.create_index("category_slug")
    await db.products.create_index("collection_slugs")
    await db.categories.create_index("slug", unique=True)
    await db.collections.create_index("slug", unique=True)

    print(
        f"Seeded {len(data['categories'])} categories, "
        f"{len(data['collections'])} collections, "
        f"{len(products)} products, "
        f"{len(data['stores'])} stores, "
        f"{len(data['reviews'])} reviews "
        f"into {settings.mongodb_db}"
    )
    client.close()


if __name__ == "__main__":
    asyncio.run(seed())
