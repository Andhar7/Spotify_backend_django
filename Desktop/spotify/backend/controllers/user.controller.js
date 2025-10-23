import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";

// Get all users except current user
export const getAllUsers = async (req, res, next) => {
  try {
    const currentUserId = req.userId;
    console.log("Getting all users except user ID:", currentUserId);
    const users = await User.findAllExceptUser(currentUserId);
    console.log("Found users:", users.map(u => ({ id: u.id, name: u.name })));
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    next(error);
  }
};

// Get messages between current user and another user
export const getMessages = async (req, res, next) => {
  try {
    const currentUserId = req.userId;
    const { userId } = req.params;

    const messages = await Message.findBetweenUsers(currentUserId, userId);
    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.error("Error in getMessages:", error);
    next(error);
  }
};

// Send a message to another user
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.userId;
    const { receiverId, content } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, message: "Receiver ID is required" });
    }

    if (!content || content.trim() === "") {
      return res.status(400).json({ success: false, message: "Message content is required" });
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content: content.trim(),
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    next(error);
  }
};
