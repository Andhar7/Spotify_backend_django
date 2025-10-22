from __future__ import annotations
from typing import TYPE_CHECKING

from django.db import models
from django.contrib.auth.models import AbstractUser

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Stores user profile information.
    """

    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=255)
    image_url = models.ImageField(upload_to="user_images/", blank=True, null=True)

    # Override username to make email the primary identifier
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "full_name"]

    class Meta:
        db_table = "users"
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email


class Album(models.Model):
    """
    Album model representing music albums/collections.
    Contains array of Song references (one-to-many relationship).
    """

    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    image_url = models.ImageField(upload_to="album_images/")
    release_year = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "albums"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["artist"]),
            models.Index(fields=["-created_at"]),
        ]

    def __str__(self):
        return f"{self.title} by {self.artist}"


class Song(models.Model):
    """
    Song model representing individual songs.
    Duration stored in seconds.
    Optional reference to parent album.
    """

    title = models.CharField(max_length=255)
    artist = models.CharField(max_length=255)
    image_url = models.ImageField(upload_to="song_images/")
    audio_url = models.FileField(upload_to="songs/")
    duration = models.IntegerField(help_text="Duration in seconds")
    album = models.ForeignKey(
        Album, on_delete=models.CASCADE, related_name="songs", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "songs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["artist"]),
            models.Index(fields=["-created_at"]),
            models.Index(fields=["album"]),
        ]

    def __str__(self):
        return f"{self.title} by {self.artist}"


class Message(models.Model):
    """
    Message model for direct messages between users.
    Stores message content and sender/receiver relationships.
    """

    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="received_messages"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "messages"
        ordering = ["created_at"]
        indexes = [
            models.Index(fields=["sender", "receiver"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        sender_email = self.sender.email if self.sender else "unknown"
        receiver_email = self.receiver.email if self.receiver else "unknown"
        return f"Message from {sender_email} to {receiver_email}"
