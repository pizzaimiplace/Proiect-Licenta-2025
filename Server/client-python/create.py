import requests

endpoint = "http://localhost:8000/api/courses/"

data = {
    "title": "This is a new course",
    "description": "This is a new course description",
}
get_response = requests.post(endpoint, json=data)
#print(get_response.text)
#print(get_response.status_code)
print(get_response.json())