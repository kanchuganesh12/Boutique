from pydantic import BaseModel, Field


class Category(BaseModel):
    id: str | None = None
    name: str
    slug: str
    image: str | None = None
    order: int = 0
    parent_slug: str | None = None


class Collection(BaseModel):
    id: str | None = None
    name: str
    slug: str
    description: str = ""
    image: str | None = None
    type: str = "standard"
    order: int = 0
    price_min: float | None = None
    price_max: float | None = None


class Store(BaseModel):
    id: str | None = None
    name: str
    address: str
    city: str
    pincode: str
    phone: str | None = None
    maps_url: str | None = None


class Review(BaseModel):
    id: str | None = None
    product_slug: str | None = None
    name: str
    rating: int = Field(ge=1, le=5)
    text: str
    verified: bool = True
    avatar_initial: str | None = None


class NewsletterRequest(BaseModel):
    email: str


class PromoRequest(BaseModel):
    code: str
    subtotal: float = 0


class OrderItem(BaseModel):
    product_id: str
    sku: str
    name: str
    size: str | None = None
    quantity: int = Field(ge=1)
    unit_price: float


class OrderCreate(BaseModel):
    contact_email: str
    contact_name: str
    phone: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pincode: str
    items: list[OrderItem]
    promo_code: str | None = None
    guest: bool = True


class Order(BaseModel):
    id: str | None = None
    contact_email: str
    contact_name: str
    phone: str | None = None
    address_line1: str
    address_line2: str | None = None
    city: str
    state: str
    pincode: str
    items: list[OrderItem]
    subtotal: float
    discount: float = 0
    shipping: float
    total: float
    promo_code: str | None = None
    status: str = "pending"
    guest: bool = True
