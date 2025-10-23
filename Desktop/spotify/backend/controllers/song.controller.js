import { Song } from "../models/song.model.js";

// Get all songs (admin only)
export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.findAll();
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error in getAllSongs:", error);
    next(error);
  }
};

// Get 6 random featured songs
export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.getRandom(6);
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error in getFeaturedSongs:", error);
    next(error);
  }
};

// Get 4 random "Made For You" songs
export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.getRandom(4);
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error in getMadeForYouSongs:", error);
    next(error);
  }
};

// Get 4 random trending songs
export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.getRandom(4);
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error in getTrendingSongs:", error);
    next(error);
  }
};

// Get random songs with optional limit
export const getRandomSongs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const songs = await Song.getRandom(limit);
    res.status(200).json({ success: true, songs });
  } catch (error) {
    console.error("Error in getRandomSongs:", error);
    next(error);
  }
};

// Get song by ID
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = await Song.findById(id);

    if (!song) {
      return res.status(404).json({ success: false, message: "Song not found" });
    }

    res.status(200).json({ success: true, song });
  } catch (error) {
    console.error("Error in getSongById:", error);
    next(error);
  }
};
