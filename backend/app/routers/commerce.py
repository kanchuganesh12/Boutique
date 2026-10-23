from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.db import get_db
from bson import ObjectId
from bson.errors import InvalidId

from app.models.catalog import NewsletterRequest, OrderCreate, PromoRequest
from app.services.serialize import serialize_doc

router = APIRouter(tags=["commerce"])

FREE_SHIPPING_THRESHOLD = 2999.0
SHIPPING_FEE = 99.0

# Demo promo codes; move to a collection when promos need to be managed.
PROMOS = {
    "FESTIVE10": {"percent": 10, "min_subtotal": 0, "label": "10% off festive edit"},
    "WELCOME500": {"flat": 500, "min_subtotal": 3000, "label": "₹500 off orders above ₹3,000"},
}


def _promo_discount(code: str | None, subtotal: float) -> tuple[float, str | None]:
    if not code:
        return 0.0, None
    promo = PROMOS.get(code.strip().upper())
    if not promo:
        raise HTTPException(status_code=400, detail="This code isn't valid.")
    if subtotal < promo["min_subtotal"]:
        raise HTTPException(
            status_code=400,
            detail=f"Add ₹{promo['min_subtotal'] - subtotal:,.0f} more to use this code.",
        )
    if "percent" in promo:
        return round(subtotal * promo["percent"] / 100), promo["label"]
    return min(promo["flat"], subtotal), promo["label"]


@router.post("/promo/validate")
async def validate_promo(body: PromoRequest):
    discount, label = _promo_discount(body.code, body.subtotal)
    return {"code": body.code.strip().upper(), "discount": discount, "label": label}


@router.post("/newsletter/subscribe")
async def subscribe(body: NewsletterRequest):
    db = get_db()
    email = body.email.strip().lower()
    if "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email")
    await db.newsletter.update_one(
        {"email": email},
        {"$set": {"email": email, "subscribed_at": datetime.utcnow()}},
        upsert=True,
    )
    return {"ok": True, "message": "Thank you for subscribing."}


@router.post("/orders")
async def create_order(body: OrderCreate):
    db = get_db()
    subtotal = sum(i.unit_price * i.quantity for i in body.items)
    discount, _ = _promo_discount(body.promo_code, subtotal)
    shipping = 0.0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_FEE
    total = subtotal - discount + shipping
    doc = {
        **body.model_dump(),
        "subtotal": subtotal,
        "discount": discount,
        "shipping": shipping,
        "total": total,
        "status": "pending",
        "created_at": datetime.utcnow(),
    }
    result = await db.orders.insert_one(doc)
    saved = await db.orders.find_one({"_id": result.inserted_id})
    return serialize_doc(saved)


@router.get("/orders/{order_id}")
async def get_order(order_id: str):
    db = get_db()
    try:
        oid = ObjectId(order_id)
    except InvalidId:
        raise HTTPException(status_code=404, detail="Order not found")
    doc = await db.orders.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=404, detail="Order not found")
    return serialize_doc(doc)
