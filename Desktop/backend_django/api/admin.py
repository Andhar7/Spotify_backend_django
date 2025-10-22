from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Song, Album, Message


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Admin configuration for User model"""
    list_display = ['email', 'full_name', 'is_staff', 'is_active', 'date_joined']
    list_filter = ['is_staff', 'is_active', 'date_joined']
    search_fields = ['email', 'full_name']
    ordering = ['-date_joined']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'image_url')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'password1', 'password2'),
        }),
    )


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    """Admin configuration for Song model"""
    list_display = ['title', 'artist', 'album', 'duration', 'created_at']
    list_filter = ['album', 'created_at']
    search_fields = ['title', 'artist']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Song Information', {
            'fields': ('title', 'artist', 'duration', 'album')
        }),
        ('Media Files', {
            'fields': ('image_url', 'audio_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    """Admin configuration for Album model"""
    list_display = ['title', 'artist', 'release_year', 'songs_count', 'created_at']
    list_filter = ['release_year', 'created_at']
    search_fields = ['title', 'artist']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'songs_count']

    fieldsets = (
        ('Album Information', {
            'fields': ('title', 'artist', 'release_year', 'image_url')
        }),
        ('Statistics', {
            'fields': ('songs_count',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def songs_count(self, obj):
        return obj.songs.count()
    songs_count.short_description = 'Number of Songs'


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Admin configuration for Message model"""
    list_display = ['sender', 'receiver', 'content_preview', 'created_at']
    list_filter = ['created_at']
    search_fields = ['sender__email', 'receiver__email', 'content']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Message Details', {
            'fields': ('sender', 'receiver', 'content')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def content_preview(self, obj):
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content Preview'
