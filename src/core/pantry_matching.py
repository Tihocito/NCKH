from __future__ import annotations

from dataclasses import dataclass
from rapidfuzz import fuzz
from .pantry_utils_text import normalize

SYNONYMS = {
    "thit heo": ["heo", "lon", "thit lon"],
    "thit ga": ["ga"],
    "thit bo": ["bo"],
    "nuoc mam": ["mam"],
    "ca chua": ["cachua", "tomato"],
    "dua chuot": ["dua leo", "cucumber"],
    "thit ba chi": ["ba chi", "thit ba chi heo"],
    "thit bam": ["thit xay", "thit heo xay"],
    "tom": ["tep"],
    "hanh la": ["hanh"],
    "hanh tim": ["hanh"],
    "hanh tay": ["hanh"],
}

PANTRY_STAPLES = {"muoi", "tieu", "duong", "nuoc mam", "dau an", "toi", "hanh tim"}

def expand_term(term: str) -> set[str]:
    t = normalize(term)
    out = {t}
    for k, vs in SYNONYMS.items():
        nk = normalize(k)
        nvs = [normalize(x) for x in vs]
        if t == nk or t in nvs:
            out.add(nk)
            out.update(nvs)
    return {x for x in out if x}

def best_match(query: str, candidates: list[str]) -> tuple[str | None, float]:
    q = normalize(query)
    if not q or not candidates:
        return None, 0.0
    eqs = expand_term(q)
    best_c, best_s = None, 0.0
    for c in candidates:
        nc = normalize(c)
        if not nc:
            continue
        s = 0.0
        for eq in eqs:
            s = max(s, fuzz.token_set_ratio(eq, nc))
        if s > best_s:
            best_c, best_s = c, float(s)
    return best_c, best_s

@dataclass
class MatchResult:
    matched: list[str]
    missing: list[str]
    substitutions: dict[str, str]
    match_score: float  # 0..1

def match_ingredients(
    available: list[str],
    required: list[str],
    fuzzy_threshold: float = 78.0,
) -> MatchResult:
    matched, missing = [], []
    substitutions: dict[str, str] = {}

    avail = [a for a in available if normalize(a)]
    req = [r for r in required if normalize(r)]

    for r in req:
        best_c, s = best_match(r, avail)
        if best_c is not None and s >= fuzzy_threshold:
            matched.append(r)
        else:
            missing.append(r)
            if best_c is not None and s >= 60:
                substitutions[r] = best_c

    denom = max(1, len(req))
    base = len(matched) / denom

    # phạt thiếu “gia vị cơ bản” nhẹ hơn
    penalty = 0.0
    for m in missing:
        penalty += 0.35 if normalize(m) in PANTRY_STAPLES else 1.0
    penalty_factor = min(1.0, penalty / denom)

    score = max(0.0, base - 0.35 * penalty_factor)

    return MatchResult(
        matched=matched,
        missing=missing,
        substitutions=substitutions,
        match_score=float(score),
    )
