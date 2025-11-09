from django.urls import path
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    StudentNilaiListView,
    InstructorNilaiListCreateView,
    StudentListView,
)
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('majors/', views.get_major_choices, name='get_major_choices'),
    path('nilai/student/', StudentNilaiListView.as_view(), name='nilai_student_list'),
    path('nilai/instructor/', InstructorNilaiListCreateView.as_view(), name='nilai_instructor_list_create'),
    path('students/', StudentListView.as_view(), name='students_list'),
]
