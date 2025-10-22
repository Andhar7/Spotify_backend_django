from django.core.management.base import BaseCommand
from api.models import Album, Song


class Command(BaseCommand):
    help = 'Seeds the database with sample albums and assigns songs to them'

    def handle(self, *args, **kwargs):
        # Clear existing albums
        Album.objects.all().delete()
        self.stdout.write('Cleared existing albums')

        # Sample albums data
        albums_data = [
            {
                'title': 'Abbey Road',
                'artist': 'The Beatles',
                'release_year': 1969,
                'song_titles': ['Yesterday'],  # Songs that should belong to this album
            },
            {
                'title': 'A Night at the Opera',
                'artist': 'Queen',
                'release_year': 1975,
                'song_titles': ['Bohemian Rhapsody'],
            },
            {
                'title': 'Led Zeppelin IV',
                'artist': 'Led Zeppelin',
                'release_year': 1971,
                'song_titles': ['Stairway to Heaven'],
            },
            {
                'title': 'Thriller',
                'artist': 'Michael Jackson',
                'release_year': 1982,
                'song_titles': ['Billie Jean'],
            },
        ]

        created_count = 0
        for album_data in albums_data:
            album = Album.objects.create(
                title=album_data['title'],
                artist=album_data['artist'],
                release_year=album_data['release_year'],
                # Note: image_url needs to be set manually or via admin
            )

            # Assign songs to this album
            for song_title in album_data['song_titles']:
                try:
                    song = Song.objects.get(title=song_title)
                    song.album = album
                    song.save()
                    self.stdout.write(f'  Assigned song "{song_title}" to album "{album.title}"')
                except Song.DoesNotExist:
                    self.stdout.write(
                        self.style.WARNING(f'  Song "{song_title}" not found')
                    )

            created_count += 1
            self.stdout.write(f'Created album: {album.title}')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {created_count} albums. '
                'Note: Please add image files via Django admin.'
            )
        )
