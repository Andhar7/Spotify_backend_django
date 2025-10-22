from rest_framework import permissions
from django.conf import settings


class IsAdminUser(permissions.BasePermission):
    """
    Custom permission to only allow admin users.
    Admin status is determined by checking if the user's email
    matches the ADMIN_EMAIL in settings.
    """

    def has_permission(self, request, view):
        # User must be authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if user email matches admin email
        return request.user.email == settings.ADMIN_EMAIL


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit/delete it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner
        return obj.sender == request.user if hasattr(obj, 'sender') else False
