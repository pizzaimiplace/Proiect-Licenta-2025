import requests

course_id = input("Enter the course ID to delete: ")
try:
    course_id = int(course_id)
except:
    course_id = None
    print("Invalid course ID")

if course_id:
    endpoint = f"http://localhost:8000/api/courses/{course_id}/delete/"

    get_response = requests.delete(endpoint)
    #print(get_response.text)
    #print(get_response.status_code)
    print(get_response.status_code, get_response.status_code == 204)