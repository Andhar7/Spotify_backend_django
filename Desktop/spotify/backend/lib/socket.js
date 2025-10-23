import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

// Store user socket connections and activities
const userSockets = new Map(); // userId -> socketId
const userActivities = new Map(); // userId -> activity string

export const initializeSocket = (httpServer) => {
  console.log("🔌 Initializing Socket.IO server...");
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  console.log("✅ Socket.IO server initialized, waiting for connections...");

  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    // Handle user connection
    socket.on("user_connected", (userId) => {
      console.log("👤 User registered:", userId, "with socket:", socket.id);
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");
      console.log("📋 Updated userSockets map:", Array.from(userSockets.entries()));

      // Broadcast to all clients that a user connected
      io.emit("user_connected", userId);
      console.log("📢 Broadcasted user_connected for user:", userId);

      // Send list of all online users to the newly connected user
      const onlineUsers = Array.from(userSockets.keys());
      console.log("📤 Sending online users list:", onlineUsers);
      socket.emit("users_online", onlineUsers);

      // Send all current activities to the newly connected user
      socket.emit("activities", Array.from(userActivities.entries()));
    });

    // Handle activity updates (playing, paused, etc.)
    socket.on("update_activity", ({ userId, activity }) => {
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    // Handle sending messages
    socket.on("send_message", async ({ senderId, receiverId, content }) => {
      console.log("📨 Received send_message event:", { senderId, receiverId, content });
      try {
        // Save message to database
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });
        console.log("💾 Message saved to database:", message);

        // Get receiver's socket ID
        const receiverSocketId = userSockets.get(receiverId);
        console.log("🔍 Looking for receiver socket ID for user:", receiverId);
        console.log("📋 Current userSockets map:", Array.from(userSockets.entries()));
        console.log("🎯 Receiver socket ID:", receiverSocketId);

        // Send message to receiver if they're online
        if (receiverSocketId) {
          console.log("✅ Sending message to receiver socket:", receiverSocketId);
          io.to(receiverSocketId).emit("receive_message", message);
        } else {
          console.log("⚠️ Receiver is offline, message saved but not sent via socket");
        }

        // Confirm message sent to sender
        console.log("📤 Sending message_sent confirmation to sender");
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("❌ Error sending message:", error);
        socket.emit("message_error", "Failed to send message");
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Find and remove the user from our maps
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }

      // Broadcast to all clients that the user disconnected
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });

  return io;
};
