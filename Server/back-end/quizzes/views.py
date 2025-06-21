from django.template.defaultfilters import title
from django.template.defaulttags import querystring
from rest_framework import generics, mixins
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Quiz, Screen
from .serializers import QuizSerializer, ScreenSerializer

class QuizMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    queryset = Quiz.objects.all()
    serializer_class = QuizSerializer
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        id = kwargs.get('id')
        if id is not None:
            return self.retrieve(request, *args, **kwargs)
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        title = serializer.validated_data.get('title')
        description = serializer.validated_data.get('description') or "No description provided"
        serializer.save(title=title, description=description)

class ScreenMixinView(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    generics.GenericAPIView
):
    serializer_class = ScreenSerializer

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        return Screen.objects.filter(quiz__id=quiz_id)

    def get_object(self):
        queryset = self.get_queryset()
        return generics.get_object_or_404(queryset, id=self.kwargs.get('screen_id'))

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        quiz_id = self.kwargs.get('quiz_id')
        quiz = Quiz.objects.get(id=quiz_id)
        serializer.save(quiz=quiz)