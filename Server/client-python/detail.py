import requests

endpoint = "http://localhost:8000/api/courses/8/lessons/1/"

get_response = requests.get(endpoint)
#print(get_response.text)
#print(get_response.status_code)
print(get_response.json())