from django.contrib import admin
from .models import CustomUser, Nilai
from django.contrib.auth.admin import UserAdmin
# Register your models here.

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'full_name', 'major', 'role')

    list_filter = ('role', 'major')

    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('full_name', 'major', 'role')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'full_name', 'major', 'role', 'password1', 'password2'),
        }),
    )

    ordering = ('email',)
admin.site.register(CustomUser, CustomUserAdmin)

@admin.register(Nilai)
class NilaiAdmin(admin.ModelAdmin):
    list_display = ('id', 'course', 'student', 'instructor', 'score', 'created_at')
    list_filter = ('course', 'instructor')
    search_fields = ('student__email', 'student__full_name', 'course')
