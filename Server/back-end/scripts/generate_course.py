import os
import sys

sys.path.append(os.path.abspath('..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cfehome.settings')  # <- replace this
import django
django.setup()

import requests
import json
from courses.models import Course, Lesson, Screen

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


course_data = {
    "title": "The Base of The Basics",
    "description": "This is an introductory course to the most basic concepts of music theory and the piano.",
    "lessons": [
            {
            "title": "The Way a Piano works",
            "screens": [
                {
                    "text": "Welcome to the first of many lessons!",
                    "play_piano": False,
                },
                {
                    "text": "This lesson will teach you the basics of the piano",
                    "play_piano": False,
                },
{
                    "text": "First, let's talk about the keys",
                    "play_piano": False,
                },
{
                    "text": "The piano has 88 keys, which are divided into white and black keys. But for simplicity, we will use only 24 keys.",
                    "play_piano": False,
                },
{
                    "text": "The white keys (highlighted below) are called natural notes.",
                    "play_piano": False,
                    "notes": [["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5", "D5", "E5", "F5", "G5", "A5", "B5"]]
                },
{
                    "text": "The black keys (highlighted below) are called sharps and flats, but for now we'll call all of them sharps. They are noted with a '#' symbol.",
                    "play_piano": False,
                    "notes": [["Cs4", "Ds4", "Fs4", "Gs4", "As4", "Cs5", "Ds5", "Fs5", "Gs5", "As5"]]
                },
{
                    "text": "Try playing some notes! To do that, click on the piano keys below using the mouse or the keyboard.",
                    "play_piano": False,
                },
{
                    "text": "Now let's talk about octaves.",
                    "play_piano": False,
                },
{
                    "text": "One octave means 12 consecutive notes.",
                    "play_piano": False,
                },
{
                    "text": "For example, the notes C4 and C5 are one octave apart. They are the same note, but played in different frequencies.",
                    "play_piano": False,
                    "notes": [["C4", "C5"]]
                },
{
                    "text": "Let's try playing some notes. Play E4 and E5",
                    "play_piano": True,
                    "notes": [["E4"], ["E5"]],
                    "ordered": False,
                    "consecutive": False,
                    "allow_mistakes": True,
                    "chord": False
                },
{
                    "text": "Great! Now let's try playing all the notes in the first octave.",
                    "play_piano": True,
                    "notes": [["C4", "Cs4", "D4", "Ds4", "E4", "F4", "Fs4", "G4", "Gs4", "A4", "As4", "B4"]],
                    "ordered": False,
                    "consecutive": False,
                    "allow_mistakes": True,
                    "chord": False
                },
{
                    "text": "Congratulations! You have completed the first lesson!",
                    "play_piano": False,
                }
            ]
        },
        {
            "title": "Tones and Semitones",
            "screens": [
                {
                    "text": "Welcome to the second lesson!",
                    "play_piano": False,
                },
{
                    "text": "Now we will talk about the way we measure the distance between notes.",
                    "play_piano": False,
                },
{
                    "text": "Between any 2 consecutive notes, the distance is called a semitone.",
                    "play_piano": False,
                },
{
                    "text": "For example, the distance between D4 and D#4 is a semitone.",
                    "play_piano": False,
                    "notes": [["D4", "Ds4"]]
                },
{
                    "text": "And the distance between E4 and F4 is also a semitone.",
                    "play_piano": False,
                    "notes": [["E4", "F4"]]
                },
{
                    "text": "But the distance between E4 and F#4 is a tone. That's because 2 semitones make a tone.",
                    "play_piano": False,
                    "notes": [["E4", "Fs4"]]
                },
{
                    "text": "I hope you get the idea. Now try playing the notes that are a semitone apart starting from A4",
                    "play_piano": True,
                    "notes": [["Gs4", "As4"]],
                    "ordered": False,
                    "consecutive": False,
                    "allow_mistakes": True,
                    "chord": False
                },
{
                    "text": "Perfect! You've completed the second lesson!",
                    "play_piano": False,
                },
{
                    "text": "I suggest you try the first quiz now, good luck!",
                    "play_piano": False,
                },
            ]
        }
    ]
}

quizzes_url = "http://localhost:8000/api/courses/"
response = requests.post(quizzes_url, headers=headers, json=course_data)

print(response.status_code)
print(json.dumps(response.json(), indent=2))
