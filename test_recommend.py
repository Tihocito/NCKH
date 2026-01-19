import time
time.sleep(3)

import requests

response = requests.post('http://127.0.0.1:5000/api/recommend', json={
    'symptoms': 'cam lanh',
    'age': 30,
    'weight': 70,
    'height': 175,
    'gender': 'male'
})

print('Status:', response.status_code)
if response.status_code == 200:
    print('Response:', response.json())
else:
    print('Error:', response.text)