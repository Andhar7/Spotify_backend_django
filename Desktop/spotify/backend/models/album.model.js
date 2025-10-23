import { query } from "../db/connectDB.js";
import { Song } from "./song.model.js";

export const Album = {
  // Create a new album
  async create({ title, artist, imageUrl, releaseYear }) {
    const sql = `
      INSERT INTO albums (title, artist, image_url, release_year)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, artist, image_url as "imageUrl", release_year as "releaseYear",
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const result = await query(sql, [title, artist, imageUrl, releaseYear]);
    return result.rows[0];
  },

  // Find all albums
  async findAll() {
    const sql = `
      SELECT
        a.id,
        a.title,
        a.artist,
        a.image_url as "imageUrl",
        a.release_year as "releaseYear",
        a.created_at as "createdAt",
        a.updated_at as "updatedAt",
        COALESCE(
          json_agg(
            json_build_object(
              'id', s.id,
              'title', s.title,
              'artist', s.artist,
              'imageUrl', s.image_url,
              'audioUrl', s.audio_url,
              'duration', s.duration,
              'albumId', s.album_id,
              'createdAt', s.created_at,
              'updatedAt', s.updated_at
            )
            ORDER BY s.created_at ASC
          ) FILTER (WHERE s.id IS NOT NULL),
          '[]'::json
        ) as songs
      FROM albums a
      LEFT JOIN songs s ON a.id = s.album_id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;
    const result = await query(sql);
    return result.rows;
  },

  // Find album by ID
  async findById(id) {
    const sql = `
      SELECT id, title, artist, image_url as "imageUrl", release_year as "releaseYear",
             created_at as "createdAt", updated_at as "updatedAt"
      FROM albums
      WHERE id = $1
    `;
    const result = await query(sql, [id]);
    return result.rows[0] || null;
  },

  // Find album by ID with songs populated
  async findByIdWithSongs(id) {
    const album = await this.findById(id);
    if (!album) return null;

    // Get all songs for this album
    const songs = await Song.findByAlbumId(id);
    album.songs = songs;

    return album;
  },

  // Delete album
  async delete(id) {
    const sql = `DELETE FROM albums WHERE id = $1`;
    await query(sql, [id]);
  },

  // Count all albums
  async count() {
    const sql = `SELECT COUNT(*) as count FROM albums`;
    const result = await query(sql);
    return parseInt(result.rows[0].count);
  }
};
