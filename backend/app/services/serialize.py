from datetime import datetime
from typing import Any


def serialize_doc(doc: dict[str, Any] | None) -> dict[str, Any] | None:
    if not doc:
        return None
    out = dict(doc)
    if "_id" in out:
        out["id"] = str(out.pop("_id"))
    if isinstance(out.get("created_at"), datetime):
        out["created_at"] = out["created_at"].isoformat()
    return out


def serialize_many(docs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [serialize_doc(d) for d in docs if d]  # type: ignore[misc]
