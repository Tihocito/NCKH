import re
import unicodedata

_SPACE_RE = re.compile(r"\s+")
_NON_WORD_RE = re.compile(r"[^0-9a-zA-Z\s]+")

def strip_accents(text: str) -> str:
    text = unicodedata.normalize("NFD", text)
    text = "".join(ch for ch in text if unicodedata.category(ch) != "Mn")
    return unicodedata.normalize("NFC", text)

def normalize(text: str) -> str:
    if not text:
        return ""
    text = text.strip().lower()
    text = strip_accents(text)
    text = _NON_WORD_RE.sub(" ", text)
    text = _SPACE_RE.sub(" ", text).strip()
    return text

def split_ingredients(text: str) -> list[str]:
    if not text:
        return []
    for sep in [";", "\n", "\t"]:
        text = text.replace(sep, ",")
    items = [x.strip() for x in text.split(",")]
    return [x for x in items if x]
