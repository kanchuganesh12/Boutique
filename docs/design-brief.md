# Ethnic Womenswear Boutique — Design Specs

Brand-neutral Indian ethnic-wear e-commerce boutique. Tech: **React + TypeScript (Vite) + Tailwind**, **FastAPI**, **MongoDB**. Mobile-first.

## Mood
handcrafted, festive, elegant, trustworthy, warm, uncluttered. Editorial photography. Generous whitespace.

## Design tokens (9–23)
- Primary `--color-primary`: `#7A1F2B` (maroon CTAs, sale tags, links)
- Accent `--color-accent`: `#C8891B` (muted gold highlights)
- Neutrals: bg `#FBF8F4`, text `#1C1A17`, muted `#6B6459`, border `#EDE7DE`
- Sale/promo: distinct red/orange for discounts only
- Badges: Pre-Order (blue-grey), New (accent), Best Seller (primary)
- Buttons: primary filled, secondary outline, tertiary underline link
- Spacing: 4/8/12/16/24/32/48/64/96; radius 4/8/16/pill; shadow sm/md/lg
- z-index: base, sticky header, dropdown, drawer, modal, toast
- Display: elegant serif; Body: clean sans. H1 40–56 / H2 32–40 / H3 24–28 / body 15–16 / caption 12–13 (mobile ~25% smaller)
- Product name: sans 14–15px, 2-line ellipsis + subtle SKU; price bold; sale struck + sale color

## Layout (24–29)
Container max 1280–1440px; gutters 16–24 mobile / 40–80 desktop. Product grid 4 / 3 / 2. Section spacing 64–96 desktop / 40–56 mobile. Soft radii 8–16; pills for chips.

## Global chrome (30–41)
Sticky header: left menu, center logo (~44–52px), right search/account/cart(+badge)/wishlist. Mega-menu desktop; left drawer mobile. Search overlay with suggestions. Mini-cart right drawer. WhatsApp float. Announcement bar + trust marquee.

## Homepage section order
1. Announcement bar → 2. Header → 3. Hero slider → 4. Trust marquee → 5. Top Collections → 6. Dress the Moment → 7. Best Sellers → 8. Shop-by-Price → 9. Occasion tabs → 10. Inside Brand → 11. New Arrivals + chips → 12. Category spotlights → 13. Reels → 14. Trust badges → 15. Testimonials → 16. Stores → 17. Footer

## Product card (62–70)
3:4 image, badges TL, heart TR, name+SKU, price, hover Add/Quick View; image swap on hover; mobile always-visible add ≥44px; skeletons.

## Other pages
- Collection: breadcrumb, filters (category/price/color/fabric/occasion/size/availability), sort, grid, load more, empty state
- PDP: gallery+zoom, buy box, size guide, related, sticky mobile ATC
- Cart/Checkout: editable lines, promo, multi-step or single-page checkout, guest checkout (no real payment credentials)

## Cross-cutting (100)
Motion 150–250ms, prefers-reduced-motion; responsive 360/768/1024/1440; WCAG AA; lazy images; preload hero; no horizontal scroll except carousels.
