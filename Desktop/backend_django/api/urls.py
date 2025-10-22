from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router and register viewsets
router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='user')
router.register(r'songs', views.SongViewSet, basename='song')
router.register(r'albums', views.AlbumViewSet, basename='album')
router.register(r'messages', views.MessageViewSet, basename='message')

urlpatterns = [
    # Router URLs
    path('', include(router.urls)),

    # Custom endpoints
    path('admin/check/', views.check_admin, name='check-admin'),
    path('stats/', views.get_stats, name='stats'),
]
