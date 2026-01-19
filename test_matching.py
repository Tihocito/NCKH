from src.core.matching_engine import MatchingEngine
from src.core.fuzzy_inference import FuzzyInferenceSystem
from src.core.knowledge_engine import KnowledgeEngine
from src.core.safety_checker import SafetyChecker

# Initialize
knowledge_engine = KnowledgeEngine()
fuzzy_system = FuzzyInferenceSystem()
matching_engine = MatchingEngine()
safety_checker = SafetyChecker()
matching_engine.initialize(fuzzy_system, knowledge_engine, safety_checker)

# Test recommendations
user_input = {
    'symptoms': ['mệt mỏi', 'đau đầu'],
    'age': 30,
    'weight': 70,
    'height': 175,
    'gender': 'male'
}

recommendations = matching_engine.get_recommendations(
    user_symptoms=user_input,
    user_info=user_input,
    top_n=10
)

recs = recommendations.get('recommendations', [])
print(f'Số món gợi ý: {len(recs)}')
categories = {}
for r in recs:
    cat = r.get('category_label', 'Unknown')
    categories[cat] = categories.get(cat, 0) + 1
print('Categories:')
for cat, count in categories.items():
    print(f'  {cat}: {count}')
for r in recs[:5]:
    print(f'- {r["name"]} ({r.get("category_label", "Unknown")})')