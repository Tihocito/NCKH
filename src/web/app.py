from __future__ import annotations

from pathlib import Path
from flask import Flask, request, jsonify

# Pantry recommender
from src.core.pantry_recommender import load_dishes, recommend_pantry, build_shopping_list

def create_app() -> Flask:
    app = Flask(__name__)

    # Load dishes once
    dishes_path = Path("data") / "dishes.json"
    PANTRY_DISHES = load_dishes(dishes_path)

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.post("/api/pantry/recommend")
    def pantry_recommend():
        payload = request.get_json(force=True, silent=True) or {}
        ingredients = payload.get("ingredients", []) or []
        k = int(payload.get("k", 12))

        results = recommend_pantry(PANTRY_DISHES, ingredients, k=k)
        shopping = build_shopping_list(results)

        return jsonify({
            "mode": "pantry",
            "input_ingredients": ingredients,
            "results": results,
            "shopping_list": shopping
        })

    return app

# Export "app" for: from src.web.app import app
app = create_app()
