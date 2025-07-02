import os
import sys

# Setup Django project path and settings
sys.path.append(os.path.abspath('..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cfehome.settings')  # <- replace this
import django
django.setup()

import requests
import json
from quizzes.models import Quiz, Screen

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

quiz = Quiz.objects.create(
    title="Beginner Music Quiz",
    description="Test your understanding of basic notes and rhythm patterns."
)
data = {
    "title": quiz.title,
    "description": quiz.description
}
screens_data = [
    {
        "text": "Play C and E in any order",
        "notes": [["C"], ["E"]],
        "ordered": False,
        "consecutive": False,
        "allow_mistakes": True,
        "chord": False
    },
    {
        "text": "Play G and B as a chord",
        "notes": [["G", "B"]],
        "ordered": False,
        "consecutive": False,
        "allow_mistakes": False,
        "chord": True
    },
    {
        "text": "Play A then D in order",
        "notes": [["A"], ["D"]],
        "ordered": True,
        "consecutive": True,
        "allow_mistakes": False,
        "chord": False
    }
]

for data in screens_data:
    screen = Screen.objects.create(
        quiz=quiz,
        text=data["text"],
        notes=data["notes"],
        ordered=data["ordered"],
        consecutive=data["consecutive"],
        allow_mistakes=data["allow_mistakes"],
        chord=data["chord"]
    )
quiz_data = {
    "title": "Quiz nou 2",
    "description": "asta e quizu",
    "screens": [
        {
            "text": "Play C and E in any order",
            "notes": [["C4"], ["E4"]],
            "ordered": False,
            "consecutive": False,
            "allow_mistakes": True,
            "chord": False
        },
        {
            "text": "Play G and B as a chord",
            "notes": [["G4", "B4"]],
            "ordered": False,
            "consecutive": False,
            "allow_mistakes": False,
            "chord": True
        },
        {
            "text": "Play A then D in order",
            "notes": [["A4"], ["D4"]],
            "ordered": True,
            "consecutive": True,
            "allow_mistakes": False,
            "chord": False
        }
    ]
}
print(f"Created quiz: {quiz.title} with {quiz.screens.count()} screens.")
quizzes_url = "http://localhost:8000/api/quizzes/"
response = requests.post(quizzes_url, headers=headers, json=quiz_data)

print(response.status_code)
print(json.dumps(response.json(), indent=2))
