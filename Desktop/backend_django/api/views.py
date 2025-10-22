from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q, Count
from django.conf import settings

from .models import User, Song, Album, Message
from .serializers import (
    UserSerializer,
    SongSerializer,
    SongListSerializer,
    AlbumSerializer,
    AlbumDetailSerializer,
    MessageSerializer,
    StatsSerializer,
)
from .permissions import IsAdminUser


# ==================== AUTH VIEWS ====================


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_admin(request):
    """
    Check if the authenticated user is an admin.
    Returns 200 with {admin: True} if user is admin, 403 otherwise.
    """
    if request.user.email == settings.ADMIN_EMAIL:
        return Response({"admin": True})
    return Response({"error": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)


# ==================== USER VIEWS ====================


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving users.
    GET /api/users/ - Get all users except the authenticated user
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Exclude the authenticated user from the results"""
        return User.objects.exclude(id=self.request.user.id)

    @action(detail=True, methods=["get"], url_path="messages")
    def get_messages(self, request, pk=None):
        """
        Get all messages between authenticated user and specified user.
        GET /api/users/{id}/messages/
        """
        other_user = self.get_object()
        current_user = request.user

        # Bidirectional message query
        messages = Message.objects.filter(
            Q(sender=current_user, receiver=other_user)
            | Q(sender=other_user, receiver=current_user)
        ).order_by("created_at")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)


# ==================== SONG VIEWS ====================


class SongViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing songs.
    """

    queryset = Song.objects.all()
    serializer_class = SongSerializer

    def get_permissions(self):
        """
        Admin required for create, update, delete.
        Anyone can view.
        """
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """For admin list view, return all songs sorted by newest first"""
        if (
            self.action == "list"
            and self.request.user.is_authenticated
            and self.request.user.email == settings.ADMIN_EMAIL
        ):
            return Song.objects.all().order_by("-created_at")
        return Song.objects.all()

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def featured(self, request):
        """
        GET /api/songs/featured/ - Get 6 random featured songs
        """
        songs = Song.objects.order_by("?")[:6]
        serializer = SongListSerializer(songs, many=True)
        return Response(serializer.data)

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[AllowAny],
        url_path="made-for-you",
    )
    def made_for_you(self, request):
        """
        GET /api/songs/made-for-you/ - Get 4 random personalized songs
        """
        songs = Song.objects.order_by("?")[:4]
        serializer = SongListSerializer(songs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], permission_classes=[AllowAny])
    def trending(self, request):
        """
        GET /api/songs/trending/ - Get 4 random trending songs
        """
        songs = Song.objects.order_by("?")[:4]
        serializer = SongListSerializer(songs, many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """
        Delete a song and remove it from album if it belongs to one.
        """
        song = self.get_object()
        # Django CASCADE will handle album relationship
        return super().destroy(request, *args, **kwargs)


# ==================== ALBUM VIEWS ====================


class AlbumViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing albums.
    """

    queryset = Album.objects.all()

    def get_permissions(self):
        """
        Admin required for create, update, delete.
        Anyone can view.
        """
        if self.action in ["create", "update", "partial_update", "destroy"]:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == "retrieve":
            return AlbumDetailSerializer
        return AlbumSerializer

    def destroy(self, request, *args, **kwargs):
        """
        Delete an album and all its associated songs (CASCADE delete).
        """
        album = self.get_object()
        # Songs will be deleted automatically due to CASCADE
        return super().destroy(request, *args, **kwargs)


# ==================== STATS VIEWS ====================


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_stats(request):
    """
    GET /api/stats/ - Get platform statistics (Admin only)
    Returns: total_songs, total_albums, total_users, total_artists
    """
    total_songs = Song.objects.count()
    total_albums = Album.objects.count()
    total_users = User.objects.count()

    # Count unique artists from both songs and albums
    song_artists = Song.objects.values("artist").distinct()
    album_artists = Album.objects.values("artist").distinct()

    # Combine and get unique count
    all_artists = set()
    for artist in song_artists:
        all_artists.add(artist["artist"])
    for artist in album_artists:
        all_artists.add(artist["artist"])

    total_artists = len(all_artists)

    stats_data = {
        "total_songs": total_songs,
        "total_albums": total_albums,
        "total_users": total_users,
        "total_artists": total_artists,
    }

    serializer = StatsSerializer(stats_data)
    return Response(serializer.data)


# ==================== MESSAGE VIEWS ====================


class MessageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing messages.
    """

    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Only return messages involving the authenticated user"""
        user = self.request.user
        return Message.objects.filter(Q(sender=user) | Q(receiver=user)).order_by(
            "created_at"
        )

    def perform_create(self, serializer):
        """Set the sender to the authenticated user"""
        serializer.save(sender=self.request.user)
