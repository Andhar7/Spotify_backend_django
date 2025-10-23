import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useChatStore } from "@/store/useChatStore";
// @ts-ignore
import { useAuthStore } from "@/store/authStore";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);

  const { currentSong, isPlaying, playNext } = usePlayerStore();
  const { socket } = useChatStore();
  const { user } = useAuthStore();

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((error) => {
        console.error("Error playing audio:", error);
        // You can also show a toast notification here
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  // Handle song change
  useEffect(() => {
    if (!currentSong) return;

    const audio = audioRef.current;
    if (!audio) return;

    const isSongChange = prevSongRef.current !== currentSong.audioUrl;
    if (isSongChange) {
      audio.src = currentSong.audioUrl;
      audio.currentTime = 0;
      prevSongRef.current = currentSong.audioUrl;

      if (isPlaying) {
        audio.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      }
    }
  }, [currentSong, isPlaying]);

  // Emit activity updates via Socket.io
  useEffect(() => {
    if (!socket || !user?.id) return;

    if (isPlaying && currentSong) {
      const activity = `Playing ${currentSong.title} by ${currentSong.artist}`;
      socket.emit("update_activity", { userId: user.id.toString(), activity });
    } else {
      socket.emit("update_activity", { userId: user.id.toString(), activity: "Idle" });
    }
  }, [isPlaying, currentSong, socket, user?.id]);

  // Handle song end - play next
  const handleEnded = () => {
    playNext();
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error("Audio error:", e.currentTarget.error);
    console.error("Audio src:", e.currentTarget.src);
  };

  return (
    <audio
      ref={audioRef}
      onEnded={handleEnded}
      onError={handleError}
      preload="metadata"
      className="hidden"
    />
  );
};

export default AudioPlayer;
