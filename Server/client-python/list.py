import requests
import json

endpoint = "http://localhost:8000/api/courses/"

get_response = requests.get(endpoint)
print(get_response.status_code)
# print(get_response.text)
print(json.dumps(get_response.json(), indent=2))