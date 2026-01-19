import time
time.sleep(5)
import requests

response = requests.post('http://127.0.0.1:5000/api/recommend', json={
    'symptoms': 'mệt mỏi, đau đầu',
    'age': 30,
    'weight': 70,
    'height': 175,
    'gender': 'male'
})

print('Status:', response.status_code)
if response.status_code == 200:
    data = response.json()
    print('Success:', data['success'])
    recs = data['recommendations']
    print(f'Số món gợi ý: {len(recs)}')
    categories = {}
    for r in recs:
        cat = r.get('category_label', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    print('Categories:')
    for cat, count in categories.items():
        print(f'  {cat}: {count}')
    if recs:
        print('Ví dụ món đầu tiên:', recs[0]['name'], '-', recs[0]['category_label'])
else:
    print('Error:', response.text)