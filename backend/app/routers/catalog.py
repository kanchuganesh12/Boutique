from fastapi import APIRouter, HTTPException

from app.db import get_db
from app.services.serialize import serialize_doc, serialize_many

router = APIRouter(tags=["catalog"])


@router.get("/categories")
async def list_categories():
    db = get_db()
    cursor = db.categories.find({}).sort("order", 1)
    return serialize_many(await cursor.to_list(length=100))


@router.get("/collections")
async def list_collections():
    db = get_db()
    cursor = db.collections.find({}).sort("order", 1)
    return serialize_many(await cursor.to_list(length=100))


@router.get("/collections/{slug}")
async def get_collection(slug: str):
    db = get_db()
    doc = await db.collections.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Collection not found")
    return serialize_doc(doc)


@router.get("/stores")
async def list_stores():
    db = get_db()
    cursor = db.stores.find({})
    return serialize_many(await cursor.to_list(length=50))


@router.get("/reviews")
async def list_reviews(product_slug: str | None = None, limit: int = 12):
    db = get_db()
    query = {"product_slug": product_slug} if product_slug else {}
    cursor = db.reviews.find(query).limit(limit)
    return serialize_many(await cursor.to_list(length=limit))


@router.get("/search")
async def search(q: str = "", limit: int = 8):
    db = get_db()
    if not q.strip():
        return {"products": [], "categories": []}
    product_cursor = db.products.find(
        {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"sku": {"$regex": q, "$options": "i"}},
            ]
        }
    ).limit(limit)
    category_cursor = db.categories.find({"name": {"$regex": q, "$options": "i"}}).limit(6)
    return {
        "products": serialize_many(await product_cursor.to_list(length=limit)),
        "categories": serialize_many(await category_cursor.to_list(length=6)),
    }


@router.get("/home")
async def home_payload():
    """Aggregated homepage data for fewer round-trips."""
    db = get_db()
    categories = serialize_many(await db.categories.find({}).sort("order", 1).to_list(50))
    collections = serialize_many(await db.collections.find({}).sort("order", 1).to_list(50))
    best_sellers = serialize_many(
        await db.products.find({"is_best_seller": True}).sort("created_at", -1).limit(8).to_list(8)
    )
    new_arrivals = serialize_many(
        await db.products.find({"is_new": True}).sort("created_at", -1).limit(8).to_list(8)
    )
    party = serialize_many(
        await db.products.find({"occasion": {"$regex": "party", "$options": "i"}}).limit(8).to_list(8)
    )
    festive = serialize_many(
        await db.products.find({"occasion": {"$regex": "festive|holy|communion", "$options": "i"}})
        .limit(8)
        .to_list(8)
    )
    blouses = serialize_many(
        await db.products.find({"category_slug": "blouses"}).limit(3).to_list(3)
    )
    reviews = serialize_many(await db.reviews.find({}).limit(6).to_list(6))
    stores = serialize_many(await db.stores.find({}).to_list(10))
    return {
        "categories": categories,
        "collections": collections,
        "best_sellers": best_sellers,
        "new_arrivals": new_arrivals,
        "occasions": {"party-wear": party, "holy-communion": festive},
        "spotlights": {"designer-blouses": blouses, "best-sellers": best_sellers[:3]},
        "reviews": reviews,
        "stores": stores,
        "announcements": [
            "Complimentary shipping on orders above ₹2,999",
            "Festive pre-orders open — expected dispatch in 10–14 days",
            "Easy 7-day returns on eligible styles",
        ],
        "trust_marquee": [
            "Authentic Handcrafted Fashion",
            "Uncompromising Quality",
            "Exclusive & Unique Designs",
            "Sustainable & Ethical Sourcing",
            "Seamless Shopping Experience",
            "Trusted by Thousands",
        ],
    }
