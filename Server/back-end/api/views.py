import json
from django.forms.models import model_to_dict

from rest_framework.response import Response
from rest_framework.decorators import api_view

from courses.models import Course
from courses.serializers import CourseSerializer

@api_view(['POST'])
def api_home(request, *args, **kwargs):
    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        return Response(serializer.data)
    return Response({"invalid": "not good data"}, status=400)