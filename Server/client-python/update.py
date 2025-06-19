import requests

endpoint = "http://localhost:8000/api/courses/3/update/"

data = {
    "title": "This is an updated course",
    "description": "This is an updated course description",
}

get_response = requests.put(endpoint, json=data)
#print(get_response.text)
#print(get_response.status_code)
print(get_response.json())