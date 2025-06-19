from django.template.defaultfilters import title
from django.template.defaulttags import querystring
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Course
from .serializers import CourseSerializer

class CourseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        description = serializer.validated_data.get('description') or None
        if description is None:
            description = "No description provided"
        serializer.save(title=title, description=description)

class CourseListAPIView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

class CourseDetailAPIView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

class CourseUpdateAPIView(generics.UpdateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

    def perform_update(self, serializer):
        instance = serializer.save()
        if not instance.description:
            instance.description = "No description provided"

class CourseDestroyAPIView(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

    def perform_destroy(self, instance):
        super().perform_destroy(instance)

class CourseMixinView(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):

    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        description = serializer.validated_data.get('description') or None
        if description is None:
            description = "No description provided"
        serializer.save(title=title, description=description)

""" @api_view(['GET'], ['POST'])
def course_alt_view(request, *args, **kwargs):
    if request.method == 'GET':
        if id is not None:
            obj = get_object_or_404(Course, id=id)
            serializer = CourseSerializer(obj, many=False)
            return Response(serializer.data)
        queryset = Course.objects.all()
        serializer = CourseSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CourseSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            title = serializer.validated_data.get('title')
            description = serializer.validated_data.get('description') or None
            if description is None:
                description = "No description provided"
            serializer.save(description=description)
            return Response(serializer.data)
        return Response({"invalid": "not good data"}, status=400) """