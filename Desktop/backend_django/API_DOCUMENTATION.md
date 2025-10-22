# API Documentation

Complete API documentation for the Music Streaming Backend.

## Base URL

```
http://localhost:8000/api
```

## Authentication

Most endpoints require authentication using Token Authentication.

### Get Token

**Endpoint**: `POST /auth/login/`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response**:
```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Using Token

Include the token in the Authorization header for all authenticated requests:

```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

---

## Authentication Endpoints

### Register User

**Endpoint**: `POST /auth/registration/`

**Request Body**:
```json
{
  "email": "newuser@example.com",
  "password1": "securepassword123",
  "password2": "securepassword123",
  "full_name": "John Doe"
}
```

**Response**: `201 Created`
```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Login

**Endpoint**: `POST /auth/login/`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response**: `200 OK`
```json
{
  "key": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b"
}
```

### Logout

**Endpoint**: `POST /auth/logout/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
{
  "detail": "Successfully logged out."
}
```

### Get Current User

**Endpoint**: `GET /auth/user/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "image_url": "/media/user_images/profile.jpg",
  "date_joined": "2024-01-15T10:30:00Z"
}
```

### Check Admin Status

**Endpoint**: `GET /admin/check/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK` (if admin)
```json
{
  "admin": true
}
```

**Response**: `403 Forbidden` (if not admin)
```json
{
  "error": "Forbidden"
}
```

---

## User Endpoints

### Get All Users

**Endpoint**: `GET /users/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
[
  {
    "id": 2,
    "email": "jane@example.com",
    "full_name": "Jane Smith",
    "image_url": "/media/user_images/jane.jpg",
    "date_joined": "2024-01-20T14:15:00Z"
  },
  {
    "id": 3,
    "email": "bob@example.com",
    "full_name": "Bob Johnson",
    "image_url": null,
    "date_joined": "2024-01-22T09:00:00Z"
  }
]
```

### Get User Details

**Endpoint**: `GET /users/{id}/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
{
  "id": 2,
  "email": "jane@example.com",
  "full_name": "Jane Smith",
  "image_url": "/media/user_images/jane.jpg",
  "date_joined": "2024-01-20T14:15:00Z"
}
```

### Get Messages with User

**Endpoint**: `GET /users/{id}/messages/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "sender": 1,
    "sender_email": "user@example.com",
    "sender_name": "John Doe",
    "receiver": 2,
    "receiver_email": "jane@example.com",
    "receiver_name": "Jane Smith",
    "content": "Hello Jane!",
    "created_at": "2024-01-25T10:30:00Z",
    "updated_at": "2024-01-25T10:30:00Z"
  },
  {
    "id": 2,
    "sender": 2,
    "sender_email": "jane@example.com",
    "sender_name": "Jane Smith",
    "receiver": 1,
    "receiver_email": "user@example.com",
    "receiver_name": "John Doe",
    "content": "Hi John!",
    "created_at": "2024-01-25T10:31:00Z",
    "updated_at": "2024-01-25T10:31:00Z"
  }
]
```

---

## Song Endpoints

### Get All Songs

**Endpoint**: `GET /songs/`

**Response**: `200 OK`
```json
{
  "count": 50,
  "next": "http://localhost:8000/api/songs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "image_url": "/media/song_images/bohemian.jpg",
      "audio_url": "/media/songs/bohemian.mp3",
      "duration": 354,
      "album": 1,
      "album_title": "A Night at the Opera",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Song Details

**Endpoint**: `GET /songs/{id}/`

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "image_url": "/media/song_images/bohemian.jpg",
  "audio_url": "/media/songs/bohemian.mp3",
  "duration": 354,
  "album": 1,
  "album_title": "A Night at the Opera",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Get Featured Songs

**Endpoint**: `GET /songs/featured/`

**Response**: `200 OK`
```json
[
  {
    "id": 1,
    "title": "Bohemian Rhapsody",
    "artist": "Queen",
    "image_url": "/media/song_images/bohemian.jpg",
    "duration": 354
  },
  // ... 5 more songs
]
```

### Get Made For You Songs

**Endpoint**: `GET /songs/made-for-you/`

**Response**: `200 OK`
```json
[
  {
    "id": 5,
    "title": "Hotel California",
    "artist": "Eagles",
    "image_url": "/media/song_images/hotel.jpg",
    "duration": 391
  },
  // ... 3 more songs
]
```

### Get Trending Songs

**Endpoint**: `GET /songs/trending/`

**Response**: `200 OK`
```json
[
  {
    "id": 8,
    "title": "Sweet Child O Mine",
    "artist": "Guns N Roses",
    "image_url": "/media/song_images/sweet.jpg",
    "duration": 356
  },
  // ... 3 more songs
]
```

### Create Song (Admin Only)

**Endpoint**: `POST /songs/`

**Headers**:
- `Authorization: Token <admin_token>`
- `Content-Type: multipart/form-data`

**Request Body** (multipart/form-data):
```
title: "New Song"
artist: "Artist Name"
duration: 240
album: 1 (optional)
image_url: <file>
audio_url: <file>
```

**Response**: `201 Created`
```json
{
  "id": 10,
  "title": "New Song",
  "artist": "Artist Name",
  "image_url": "/media/song_images/newsong.jpg",
  "audio_url": "/media/songs/newsong.mp3",
  "duration": 240,
  "album": 1,
  "album_title": "Album Name",
  "created_at": "2024-01-26T12:00:00Z",
  "updated_at": "2024-01-26T12:00:00Z"
}
```

### Update Song (Admin Only)

**Endpoint**: `PUT /songs/{id}/` or `PATCH /songs/{id}/`

**Headers**: `Authorization: Token <admin_token>`

**Request Body**:
```json
{
  "title": "Updated Title",
  "duration": 245
}
```

**Response**: `200 OK`

### Delete Song (Admin Only)

**Endpoint**: `DELETE /songs/{id}/`

**Headers**: `Authorization: Token <admin_token>`

**Response**: `204 No Content`

---

## Album Endpoints

### Get All Albums

**Endpoint**: `GET /albums/`

**Response**: `200 OK`
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "A Night at the Opera",
      "artist": "Queen",
      "image_url": "/media/album_images/opera.jpg",
      "release_year": 1975,
      "songs_count": 12,
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### Get Album with Songs

**Endpoint**: `GET /albums/{id}/`

**Response**: `200 OK`
```json
{
  "id": 1,
  "title": "A Night at the Opera",
  "artist": "Queen",
  "image_url": "/media/album_images/opera.jpg",
  "release_year": 1975,
  "songs": [
    {
      "id": 1,
      "title": "Bohemian Rhapsody",
      "artist": "Queen",
      "image_url": "/media/song_images/bohemian.jpg",
      "audio_url": "/media/songs/bohemian.mp3",
      "duration": 354,
      "album": 1,
      "album_title": "A Night at the Opera",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-01-15T10:00:00Z"
    }
  ],
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Create Album (Admin Only)

**Endpoint**: `POST /albums/`

**Headers**:
- `Authorization: Token <admin_token>`
- `Content-Type: multipart/form-data`

**Request Body** (multipart/form-data):
```
title: "New Album"
artist: "Artist Name"
release_year: 2024
image_url: <file>
```

**Response**: `201 Created`

### Update Album (Admin Only)

**Endpoint**: `PUT /albums/{id}/` or `PATCH /albums/{id}/`

**Headers**: `Authorization: Token <admin_token>`

**Response**: `200 OK`

### Delete Album (Admin Only)

**Endpoint**: `DELETE /albums/{id}/`

**Headers**: `Authorization: Token <admin_token>`

**Response**: `204 No Content`

**Note**: Deleting an album will also delete all songs associated with it (CASCADE).

---

## Message Endpoints

### Get All Messages

**Endpoint**: `GET /messages/`

**Headers**: `Authorization: Token <your_token>`

**Response**: `200 OK`
```json
{
  "count": 25,
  "next": "http://localhost:8000/api/messages/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "sender": 1,
      "sender_email": "user@example.com",
      "sender_name": "John Doe",
      "receiver": 2,
      "receiver_email": "jane@example.com",
      "receiver_name": "Jane Smith",
      "content": "Hello!",
      "created_at": "2024-01-25T10:30:00Z",
      "updated_at": "2024-01-25T10:30:00Z"
    }
  ]
}
```

### Send Message

**Endpoint**: `POST /messages/`

**Headers**: `Authorization: Token <your_token>`

**Request Body**:
```json
{
  "receiver": 2,
  "content": "Hello, how are you?"
}
```

**Response**: `201 Created`
```json
{
  "id": 10,
  "sender": 1,
  "sender_email": "user@example.com",
  "sender_name": "John Doe",
  "receiver": 2,
  "receiver_email": "jane@example.com",
  "receiver_name": "Jane Smith",
  "content": "Hello, how are you?",
  "created_at": "2024-01-26T15:30:00Z",
  "updated_at": "2024-01-26T15:30:00Z"
}
```

---

## Statistics Endpoints

### Get Platform Stats (Admin Only)

**Endpoint**: `GET /stats/`

**Headers**: `Authorization: Token <admin_token>`

**Response**: `200 OK`
```json
{
  "total_songs": 150,
  "total_albums": 25,
  "total_users": 1000,
  "total_artists": 75
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "field_name": [
    "This field is required."
  ]
}
```

### 401 Unauthorized
```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden
```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found
```json
{
  "detail": "Not found."
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error."
}
```

---

## Pagination

List endpoints return paginated results:

```json
{
  "count": 100,
  "next": "http://localhost:8000/api/songs/?page=2",
  "previous": null,
  "results": [...]
}
```

- `count`: Total number of items
- `next`: URL for next page (null if last page)
- `previous`: URL for previous page (null if first page)
- `results`: Array of items for current page

Default page size: 20 items

---

## File Upload Notes

When uploading files (songs, images):

1. Use `multipart/form-data` content type
2. Include files as binary data
3. Max file size: 10MB (default Django limit)
4. Supported image formats: JPG, PNG, GIF
5. Supported audio formats: MP3, WAV, OGG

### Example with cURL

```bash
curl -X POST http://localhost:8000/api/songs/ \
  -H "Authorization: Token your_admin_token" \
  -F "title=New Song" \
  -F "artist=Artist Name" \
  -F "duration=240" \
  -F "image_url=@/path/to/image.jpg" \
  -F "audio_url=@/path/to/audio.mp3"
```
