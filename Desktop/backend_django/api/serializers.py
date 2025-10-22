from rest_framework import serializers
from .models import User, Song, Album, Message


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'image_url', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class SongSerializer(serializers.ModelSerializer):
    """Serializer for Song model"""
    album_title = serializers.CharField(source='album.title', read_only=True)

    class Meta:
        model = Song
        fields = [
            'id', 'title', 'artist', 'image_url', 'audio_url',
            'duration', 'album', 'album_title', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SongListSerializer(serializers.ModelSerializer):
    """Simplified serializer for song lists (without audio URL)"""
    class Meta:
        model = Song
        fields = ['id', 'title', 'artist', 'image_url', 'duration']


class AlbumSerializer(serializers.ModelSerializer):
    """Serializer for Album model without songs"""
    songs_count = serializers.SerializerMethodField()

    class Meta:
        model = Album
        fields = [
            'id', 'title', 'artist', 'image_url', 'release_year',
            'songs_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_songs_count(self, obj):
        return obj.songs.count()


class AlbumDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Album with all songs"""
    songs = SongSerializer(many=True, read_only=True)

    class Meta:
        model = Album
        fields = [
            'id', 'title', 'artist', 'image_url', 'release_year',
            'songs', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for Message model"""
    sender_email = serializers.EmailField(source='sender.email', read_only=True)
    sender_name = serializers.CharField(source='sender.full_name', read_only=True)
    receiver_email = serializers.EmailField(source='receiver.email', read_only=True)
    receiver_name = serializers.CharField(source='receiver.full_name', read_only=True)

    class Meta:
        model = Message
        fields = [
            'id', 'sender', 'sender_email', 'sender_name',
            'receiver', 'receiver_email', 'receiver_name',
            'content', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StatsSerializer(serializers.Serializer):
    """Serializer for statistics endpoint"""
    total_songs = serializers.IntegerField()
    total_albums = serializers.IntegerField()
    total_users = serializers.IntegerField()
    total_artists = serializers.IntegerField()
