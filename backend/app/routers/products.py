import re
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from app.db import get_db
from app.services.serialize import serialize_doc, serialize_many

router = APIRouter(prefix="/products", tags=["products"])


def _product_query(
    *,
    category: str | None = None,
    collection: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    color: str | None = None,
    fabric: str | None = None,
    occasion: str | None = None,
    size: str | None = None,
    availability: str | None = None,
    q: str | None = None,
) -> dict[str, Any]:
    query: dict[str, Any] = {}
    clauses: list[dict[str, Any]] = []
    if category:
        query["category_slug"] = category
    if collection:
        query["collection_slugs"] = collection
    if color:
        query["color"] = {"$regex": f"^{color}$", "$options": "i"}
    if fabric:
        query["fabric"] = {"$regex": fabric, "$options": "i"}
    if occasion:
        query["occasion"] = {"$regex": occasion, "$options": "i"}
    if size:
        query["sizes"] = size
    if availability == "pre-order":
        query["pre_order.is_pre_order"] = True
    elif availability == "in-stock":
        query["in_stock"] = True
        query["pre_order.is_pre_order"] = {"$ne": True}

    price_filter: dict[str, Any] = {}
    if price_min is not None:
        price_filter["$gte"] = price_min
    if price_max is not None:
        price_filter["$lte"] = price_max
    if price_filter:
        clauses.append({"$or": [
            {"sale_price": price_filter},
            {"sale_price": None, "price": price_filter},
            {"sale_price": {"$exists": False}, "price": price_filter},
        ]})

    if q:
        pattern = re.escape(q.strip())
        clauses.append({"$or": [
            {"name": {"$regex": pattern, "$options": "i"}},
            {"sku": {"$regex": pattern, "$options": "i"}},
            {"description": {"$regex": pattern, "$options": "i"}},
            {"category_slug": {"$regex": pattern, "$options": "i"}},
        ]})
    if clauses:
        query["$and"] = clauses
    return query


def _sort_spec(sort: str) -> list[tuple[str, int]]:
    mapping = {
        "featured": [("is_best_seller", -1), ("created_at", -1)],
        "price_asc": [("price", 1)],
        "price_desc": [("price", -1)],
        "newest": [("created_at", -1)],
        "best_selling": [("is_best_seller", -1), ("created_at", -1)],
    }
    return mapping.get(sort, mapping["featured"])


@router.get("")
async def list_products(
    category: str | None = None,
    collection: str | None = None,
    price_min: float | None = None,
    price_max: float | None = None,
    color: str | None = None,
    fabric: str | None = None,
    occasion: str | None = None,
    size: str | None = None,
    availability: str | None = None,
    q: str | None = None,
    sort: str = Query("featured"),
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=48),
):
    db = get_db()
    query = _product_query(
        category=category,
        collection=collection,
        price_min=price_min,
        price_max=price_max,
        color=color,
        fabric=fabric,
        occasion=occasion,
        size=size,
        availability=availability,
        q=q,
    )
    total = await db.products.count_documents(query)
    cursor = (
        db.products.find(query)
        .sort(_sort_spec(sort))
        .skip((page - 1) * limit)
        .limit(limit)
    )
    items = serialize_many(await cursor.to_list(length=limit))
    return {"items": items, "total": total, "page": page, "limit": limit}


@router.get("/best-sellers")
async def best_sellers(limit: int = Query(12, ge=1, le=24)):
    db = get_db()
    cursor = db.products.find({"is_best_seller": True}).sort("created_at", -1).limit(limit)
    return serialize_many(await cursor.to_list(length=limit))


@router.get("/new-arrivals")
async def new_arrivals(limit: int = Query(12, ge=1, le=24)):
    db = get_db()
    cursor = db.products.find({"is_new": True}).sort("created_at", -1).limit(limit)
    return serialize_many(await cursor.to_list(length=limit))


@router.get("/facets")
async def facets(category: str | None = None, collection: str | None = None, q: str | None = None):
    """Filter options available within a listing, so the UI never hardcodes them."""
    db = get_db()
    base = _product_query(category=category, collection=collection, q=q)
    colors = sorted(c for c in await db.products.distinct("color", base) if c)
    fabrics = sorted(f for f in await db.products.distinct("fabric", base) if f)
    occasions = sorted(o for o in await db.products.distinct("occasion", base) if o)
    sizes = [s for s in await db.products.distinct("sizes", base) if s]
    order = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"]
    sizes.sort(key=lambda s: (order.index(s) if s in order else len(order), s))
    has_pre_order = await db.products.count_documents({**base, "pre_order.is_pre_order": True}) > 0
    return {
        "colors": colors,
        "fabrics": fabrics,
        "occasions": occasions,
        "sizes": sizes,
        "availability": ["in-stock", "pre-order"] if has_pre_order else ["in-stock"],
    }


@router.get("/{slug}/related")
async def related_products(slug: str, limit: int = Query(8, ge=1, le=24)):
    db = get_db()
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    query = {
        "slug": {"$ne": slug},
        "$or": [
            {"category_slug": doc.get("category_slug")},
            {"occasion": doc.get("occasion")},
        ],
    }
    cursor = db.products.find(query).sort(_sort_spec("featured")).limit(limit)
    return serialize_many(await cursor.to_list(length=limit))


@router.get("/{slug}")
async def get_product(slug: str):
    db = get_db()
    doc = await db.products.find_one({"slug": slug})
    if not doc:
        raise HTTPException(status_code=404, detail="Product not found")
    return serialize_doc(doc)
