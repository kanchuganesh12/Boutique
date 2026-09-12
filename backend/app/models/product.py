from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class PreOrderInfo(BaseModel):
    is_pre_order: bool = False
    expected_date: str | None = None


class ProductImage(BaseModel):
    url: str
    alt: str = ""


class Product(BaseModel):
    id: str | None = None
    sku: str
    name: str
    slug: str
    description: str = ""
    category_slug: str
    collection_slugs: list[str] = Field(default_factory=list)
    price: float
    sale_price: float | None = None
    currency: str = "INR"
    images: list[ProductImage] = Field(default_factory=list)
    badges: list[Literal["New", "Best Seller", "Pre-Order"]] = Field(default_factory=list)
    sizes: list[str] = Field(default_factory=list)
    fabric: str | None = None
    occasion: str | None = None
    color: str | None = None
    care: str | None = None
    variant_hint: str | None = None
    pre_order: PreOrderInfo = Field(default_factory=PreOrderInfo)
    is_best_seller: bool = False
    is_new: bool = False
    in_stock: bool = True
    created_at: datetime | None = None


class ProductListResponse(BaseModel):
    items: list[Product]
    total: int
    page: int
    limit: int
