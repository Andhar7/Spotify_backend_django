from django.core.management.base import BaseCommand
from api.models import Song


class Command(BaseCommand):
    help = 'Seeds the database with sample songs'

    def handle(self, *args, **kwargs):
        # Clear existing songs
        Song.objects.all().delete()
        self.stdout.write('Cleared existing songs')

        # Sample songs data (you can customize these)
        songs_data = [
            {
                'title': 'Moonlight Sonata',
                'artist': 'Ludwig van Beethoven',
                'duration': 320,  # seconds
            },
            {
                'title': 'Bohemian Rhapsody',
                'artist': 'Queen',
                'duration': 354,
            },
            {
                'title': 'Imagine',
                'artist': 'John Lennon',
                'duration': 183,
            },
            {
                'title': 'Stairway to Heaven',
                'artist': 'Led Zeppelin',
                'duration': 482,
            },
            {
                'title': 'Hotel California',
                'artist': 'Eagles',
                'duration': 391,
            },
            {
                'title': 'Smells Like Teen Spirit',
                'artist': 'Nirvana',
                'duration': 301,
            },
            {
                'title': 'Billie Jean',
                'artist': 'Michael Jackson',
                'duration': 294,
            },
            {
                'title': 'Sweet Child O Mine',
                'artist': 'Guns N Roses',
                'duration': 356,
            },
            {
                'title': 'Yesterday',
                'artist': 'The Beatles',
                'duration': 125,
            },
            {
                'title': 'Purple Haze',
                'artist': 'Jimi Hendrix',
                'duration': 171,
            },
        ]

        # Create songs (Note: You'll need to add actual audio/image files manually)
        created_count = 0
        for song_data in songs_data:
            song = Song.objects.create(
                title=song_data['title'],
                artist=song_data['artist'],
                duration=song_data['duration'],
                # Note: image_url and audio_url need to be set manually or via admin
                # For now, leaving them empty - they can be added via Django admin
            )
            created_count += 1
            self.stdout.write(f'Created song: {song.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {created_count} songs. '
                'Note: Please add audio and image files via Django admin.'
            )
        )
