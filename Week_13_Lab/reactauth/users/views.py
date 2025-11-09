from  rest_framework import generics, permissions
from .serializers import (
    RegisterSerializer,
    CustomTokenObtainPairSerializer,
    NilaiSerializer,
    StudentListSerializer,
)
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser as User
from .models import Nilai
# Create your views here.
user = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = user.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])
def get_major_choices(request):
    choices = [
        {"value": choice[0], "label": choice[1]}
        for choice in User.MAJOR_CHOICES
    ]
    return Response(choices)


class StudentNilaiListView(generics.ListAPIView):
    serializer_class = NilaiSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) != 'student':
            return Nilai.objects.none()
        return Nilai.objects.filter(student=user).order_by('-created_at')


class InstructorNilaiListCreateView(generics.ListCreateAPIView):
    serializer_class = NilaiSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) != 'instructor':
            return Nilai.objects.none()
        return Nilai.objects.filter(instructor=user).select_related('student').order_by('-created_at')

    def perform_create(self, serializer):
        # Force the instructor to current user
        serializer.save(instructor=self.request.user)


class StudentListView(generics.ListAPIView):
    serializer_class = StudentListSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) != 'instructor':
            return User.objects.none()
        return User.objects.filter(role='student').order_by('full_name')
