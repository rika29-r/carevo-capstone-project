import requests

payload = {
    "text": "chef cooking kitchen restaurant food service but also python sql dashboard",
    "cvData": {}
}

response = requests.post("http://localhost:8000/predict-career", json=payload, timeout=20)
print(response.status_code)
print(response.json())
