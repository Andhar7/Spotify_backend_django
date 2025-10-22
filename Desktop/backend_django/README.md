# Music Streaming Backend - Django

A complete music streaming platform backend built with Django, recreated from the original Node.js/Express version.

## Features

- User authentication and authorization (Django Allauth)
- Music catalog management (Songs and Albums)
- Content discovery (Featured, Trending, Made-for-you)
- Direct messaging between users
- Admin panel for content management
- File upload support (audio files and images)
- RESTful API with Django REST Framework
- Platform statistics for admins

## Technology Stack

- **Framework**: Django 5.0.1
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: Django Allauth
- **File Storage**: Local filesystem
- **CORS**: django-cors-headers

## Project Structure

```
backend_django/
├── api/                        # Main application
│   ├── management/
│   │   └── commands/          # Custom management commands
│   │       ├── seed_songs.py  # Seed sample songs
│   │       └── seed_albums.py # Seed sample albums
│   ├── models.py              # Database models (User, Song, Album, Message)
│   ├── serializers.py         # DRF serializers
│   ├── views.py               # API views and viewsets
│   ├── urls.py                # API URL routing
│   ├── permissions.py         # Custom permissions
│   └── admin.py               # Django admin configuration
├── music_streaming/           # Project settings
│   ├── settings.py           # Django settings
│   ├── urls.py               # Root URL configuration
│   └── wsgi.py               # WSGI application
├── media/                     # User-uploaded files
├── staticfiles/              # Static files
├── requirements.txt          # Python dependencies
├── .env.sample              # Environment variables template
└── manage.py                # Django management script
```

## Prerequisites

- Python 3.11+
- PostgreSQL 12+
- pip and virtualenv

## Setup Instructions

### 1. Clone and Setup Environment

```bash
cd backend_django

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE music_streaming;

# Exit PostgreSQL
\q
```

### 3. Environment Configuration

Create a `.env` file from the sample:

```bash
cp .env.sample .env
```

Edit `.env` with your configuration:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (PostgreSQL)
DB_NAME=music_streaming
DB_USER=postgres
DB_PASSWORD=your-database-password
DB_HOST=localhost
DB_PORT=5432

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Admin Configuration
ADMIN_EMAIL=admin@example.com
```

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account.

### 6. Seed Sample Data (Optional)

```bash
# Seed songs
python manage.py seed_songs

# Seed albums (run after seeding songs)
python manage.py seed_albums
```

**Note**: The seed commands create songs/albums with metadata only. You'll need to add actual audio and image files via the Django admin panel.

### 7. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication
- `POST /api/auth/registration/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user
- `GET /api/admin/check/` - Check if user is admin (requires auth)

### Users
- `GET /api/users/` - Get all users except current user (requires auth)
- `GET /api/users/{id}/` - Get user details
- `GET /api/users/{id}/messages/` - Get messages with specific user (requires auth)

### Songs
- `GET /api/songs/` - Get all songs
- `GET /api/songs/{id}/` - Get song details
- `GET /api/songs/featured/` - Get 6 random featured songs
- `GET /api/songs/made-for-you/` - Get 4 random personalized songs
- `GET /api/songs/trending/` - Get 4 random trending songs
- `POST /api/songs/` - Create song (admin only)
- `PUT /api/songs/{id}/` - Update song (admin only)
- `DELETE /api/songs/{id}/` - Delete song (admin only)

### Albums
- `GET /api/albums/` - Get all albums
- `GET /api/albums/{id}/` - Get album with all songs
- `POST /api/albums/` - Create album (admin only)
- `PUT /api/albums/{id}/` - Update album (admin only)
- `DELETE /api/albums/{id}/` - Delete album and songs (admin only)

### Messages
- `GET /api/messages/` - Get user's messages (requires auth)
- `POST /api/messages/` - Send message (requires auth)
- `GET /api/messages/{id}/` - Get message details (requires auth)

### Statistics
- `GET /api/stats/` - Get platform stats (admin only)
  - Returns: `total_songs`, `total_albums`, `total_users`, `total_artists`

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`

Features:
- User management
- Song management (upload audio and images)
- Album management
- Message moderation
- View platform statistics

## File Uploads

Files are stored locally in the `media/` directory:
- Song audio files: `media/songs/`
- Song images: `media/song_images/`
- Album images: `media/album_images/`
- User images: `media/user_images/`

## Authentication

The API uses Django Allauth with token authentication:

1. **Register**: `POST /api/auth/registration/`
   ```json
   {
     "email": "user@example.com",
     "password1": "securepassword",
     "password2": "securepassword",
     "full_name": "John Doe"
   }
   ```

2. **Login**: `POST /api/auth/login/`
   ```json
   {
     "email": "user@example.com",
     "password": "securepassword"
   }
   ```
   Returns a token: `{"key": "token_value"}`

3. **Use Token**: Include in headers:
   ```
   Authorization: Token <token_value>
   ```

## Admin Privileges

Admin status is determined by email address. Set the `ADMIN_EMAIL` in `.env`:

```env
ADMIN_EMAIL=admin@example.com
```

Only users with this exact email address will have admin privileges.

## Development

### Running Tests

```bash
python manage.py test
```

### Creating Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Collecting Static Files (Production)

```bash
python manage.py collectstatic
```

## Production Deployment

### Using Gunicorn

```bash
gunicorn music_streaming.wsgi:application --bind 0.0.0.0:8000
```

### Environment Variables for Production

Update your `.env`:

```env
DEBUG=False
SECRET_KEY=<generate-a-strong-random-key>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

### Database Connection Pooling

For production, consider using connection pooling with PostgreSQL:

```bash
pip install psycopg2-binary django-db-pool
```

## Differences from Node.js Version

### What's Different:

1. **Authentication**: Django Allauth instead of Clerk
   - Email/password authentication instead of external service
   - Session + Token authentication

2. **File Storage**: Local filesystem instead of Cloudinary
   - Files stored in `media/` directory
   - Can be easily changed to S3 or other cloud storage

3. **Real-time Messaging**: REST API instead of Socket.io
   - Messages stored in database
   - No WebSocket support (can be added with Django Channels)

4. **Database**: PostgreSQL instead of MongoDB
   - Relational database with proper foreign keys
   - Better data integrity and querying

### What's the Same:

- All API endpoints with same functionality
- Same data models and relationships
- Admin privileges based on email
- CORS configuration
- Same business logic
- File upload support

## Troubleshooting

### Database Connection Issues

Ensure PostgreSQL is running:
```bash
# Check PostgreSQL status
pg_ctl status

# Start PostgreSQL
pg_ctl start
```

### Missing Dependencies

```bash
pip install -r requirements.txt
```

### Migration Issues

```bash
# Reset migrations (development only)
python manage.py migrate --fake api zero
python manage.py migrate
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License

## Support

For issues and questions, please create an issue in the repository.
