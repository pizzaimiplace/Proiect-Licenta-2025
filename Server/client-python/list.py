import requests
import json

auth_url = "http://localhost:8000/api/token/"
credentials = {
    "username": "catalin1",
    "password": "catalinunu"
}

auth_response = requests.post(auth_url, data=credentials)
if auth_response.status_code != 200:
    print("Failed to authenticate:", auth_response.text)
    exit()

access_token = auth_response.json().get("access")

headers = {
    "Authorization": f"Bearer {access_token}"
}

courses_url = "http://localhost:8000/api/courses/3/"
#courses_url = "http://localhost:8000/api/courses/8/"
response = requests.delete(courses_url, headers=headers)

#print(response.status_code)
#print(json.dumps(response.json(), indent=2))
