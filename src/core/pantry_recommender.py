from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .pantry_matching import match_ingredients
from .pantry_utils_text import normalize

@dataclass
class Dish:
    id: str
    name: str
    ingredients: list[str]
    tags: list[str]

def load_dishes(path: str | Path) -> list[Dish]:
    p = Path(path)
    data = json.loads(p.read_text(encoding="utf-8"))
    out: list[Dish] = []
    for d in data:
        out.append(
            Dish(
                id=str(d["id"]),
                name=str(d["name"]),
                ingredients=list(d["ingredients"]),
                tags=list(d.get("tags", [])),
            )
        )
    return out

def jaccard(a: set[str], b: set[str]) -> float:
    if not a and not b:
        return 0.0
    return len(a & b) / max(1, len(a | b))

def signature(d: Dish) -> set[str]:
    s = {normalize(x) for x in d.ingredients}
    s |= {f"tag:{normalize(t)}" for t in d.tags}
    return {x for x in s if x}

def recommend_pantry(
    dishes: list[Dish],
    available_ingredients: list[str],
    k: int = 12,
    min_score: float = 0.35,
    lambda_div: float = 0.78,
) -> list[dict[str, Any]]:
    candidates: list[dict[str, Any]] = []

    for d in dishes:
        m = match_ingredients(available_ingredients, d.ingredients)
        base = m.match_score
        if base < min_score:
            continue

        tags_norm = {normalize(t) for t in d.tags}
        bonus = 0.0
        if "quick" in tags_norm:
            bonus += 0.03
        if "veg" in tags_norm:
            bonus += 0.02
        if "soup" in tags_norm:
            bonus += 0.01

        score = min(1.0, base + bonus)

        candidates.append({
            "id": d.id,
            "name": d.name,
            "ingredients": d.ingredients,
            "tags": d.tags,
            "score": float(score),
            "matched_ingredients": m.matched,
            "missing_ingredients": m.missing,
            "substitutions": m.substitutions,
            "_sig": signature(d),
            "explanations": [],
        })

    candidates.sort(key=lambda x: x["score"], reverse=True)
    if not candidates:
        return []

    selected: list[dict[str, Any]] = []
    while candidates and len(selected) < k:
        best_i, best_val = 0, -1e9
        for i, c in enumerate(candidates):
            if not selected:
                val = c["score"]
            else:
                max_sim = max(jaccard(c["_sig"], s["_sig"]) for s in selected)
                val = lambda_div * c["score"] - (1 - lambda_div) * max_sim
            if val > best_val:
                best_val, best_i = val, i

        pick = candidates.pop(best_i)
        selected.append(pick)

    # explanations
    staples = {"muoi", "tieu", "duong", "nuoc mam", "dau an", "toi", "hanh tim"}
    for s in selected:
        matched = s["matched_ingredients"]
        missing = s["missing_ingredients"]

        reasons = []
        reasons.append(f"Khớp {len(matched)}/{len(s['ingredients'])} nguyên liệu của món.")
        if missing:
            important = [x for x in missing if normalize(x) not in staples]
            if important:
                reasons.append("Thiếu (quan trọng): " + ", ".join(important[:6]) + ("..." if len(important) > 6 else ""))
            else:
                reasons.append("Chỉ thiếu gia vị cơ bản (có thể linh hoạt).")
        if s["substitutions"]:
            pairs = list(s["substitutions"].items())[:3]
            reasons.append("Gợi ý thay thế: " + "; ".join([f"{a} ↔ {b}" for a, b in pairs]))

        s["explanations"] = reasons
        s["score"] = round(s["score"], 3)
        s.pop("_sig", None)

    return selected

def build_shopping_list(results: list[dict[str, Any]]) -> list[str]:
    seen = set()
    out = []
    for r in results:
        for x in r.get("missing_ingredients", []):
            nx = normalize(x)
            if nx and nx not in seen:
                seen.add(nx)
                out.append(x)
    return out
