import requests
import json

url = 'http://localhost:5000/api/recommend'

# Test different symptoms
test_cases = [
    'cảm lạnh',
    'sau ốm',
    'hàn',
    'đau bụng',
    'tiêu chảy'
]

for symptom in test_cases:
    try:
        data = {'symptoms': symptom, 'age': 25, 'weight': 65, 'height': 170, 'gender': 'male'}
        response = requests.post(url, json=data, timeout=10)
        result = response.json()

        print(f"\n=== Test: '{symptom}' ===")
        print(f"Status: {response.status_code}")
        print(f"Extracted symptoms: {result.get('analysis', {}).get('extracted_symptoms', [])}")
        print(f"Recommendations: {len(result.get('recommendations', []))}")

        if result.get('recommendations'):
            for i, rec in enumerate(result['recommendations'][:3]):  # Show top 3
                print(f"  {i+1}. {rec['name']} (score: {rec['score']})")
                print(f"     Benefits: {rec['benefits']}")

    except Exception as e:
        print(f"Error testing '{symptom}': {e}")