from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.db import get_db
from app.models.catalog import NewsletterRequest, OrderCreate
from app.services.serialize import serialize_doc

router = APIRouter(tags=["commerce"])


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
    shipping = 0.0 if subtotal >= 2999 else 99.0
    total = subtotal + shipping
    doc = {
        **body.model_dump(),
        "subtotal": subtotal,
        "shipping": shipping,
        "total": total,
        "status": "pending",
        "created_at": datetime.utcnow(),
    }
    result = await db.orders.insert_one(doc)
    saved = await db.orders.find_one({"_id": result.inserted_id})
    return serialize_doc(saved)
