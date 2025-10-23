import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { Message, User } from "@/types";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messages: Message[];
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (receiverId: string, senderId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
}

const baseURL = import.meta.env?.MODE === "development" ? "http://localhost:5001" : "/";

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,

  setSelectedUser: (user) => set({ selectedUser: user }),

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data.users, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch users", isLoading: false });
    }
  },

  initSocket: (userId) => {
    if (!userId) {
      console.log("❌ Socket init: No userId provided");
      return;
    }

    const currentSocket = get().socket;

    // If socket already exists (connected or connecting), don't create a new one
    if (currentSocket) {
      if (currentSocket.connected) {
        console.log("⚠️ Socket already connected, skipping initialization");
      } else {
        console.log("⚠️ Socket connection in progress, skipping initialization");
      }
      return;
    }

    console.log("🔌 Initializing socket for user:", userId);
    console.log("🔌 Connecting to:", baseURL);

    const socket = io(baseURL, {
      auth: { userId },
      withCredentials: true,
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("✅ Socket connected! Socket ID:", socket.id);
      set({ isConnected: true });
      socket.emit("user_connected", userId);
      console.log("📤 Emitted user_connected event for user:", userId);
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error);
    });

    socket.on("users_online", (users: string[]) => {
      set({ onlineUsers: new Set(users) });
    });

    socket.on("activities", (activities: [string, string][]) => {
      set({ userActivities: new Map(activities) });
    });

    socket.on("user_connected", (userId: string) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, userId]),
      }));
    });

    socket.on("user_disconnected", (userId: string) => {
      set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        newOnlineUsers.delete(userId);
        return { onlineUsers: newOnlineUsers };
      });
    });

    socket.on("receive_message", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("message_sent", (message: Message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    socket.on("activity_updated", ({ userId, activity }: { userId: string; activity: string }) => {
      set((state) => {
        const newActivities = new Map(state.userActivities);
        newActivities.set(userId, activity);
        return { userActivities: newActivities };
      });
    });

    socket.on("disconnect", () => {
      set({ isConnected: false });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      console.log("🔴 Disconnecting socket:", socket.id);
      socket.disconnect();
      socket.removeAllListeners();
    }
    set({ socket: null, isConnected: false, onlineUsers: new Set(), messages: [] });
  },

  sendMessage: async (receiverId, senderId, content) => {
    const socket = get().socket;
    if (!socket) return;

    try {
      socket.emit("send_message", { receiverId, senderId, content });
    } catch (error) {
      toast.error("Failed to send message");
    }
  },

  fetchMessages: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: response.data.messages, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || "Failed to fetch messages", isLoading: false });
    }
  },
}));
