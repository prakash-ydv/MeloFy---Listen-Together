import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRoomContext } from "./RoomContext";

const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
  const playerRef = useRef(null);

  const { socket, roomId, queueWhenJoined } = useRoomContext();
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  // queue sync
  useEffect(() => {
    setQueue(queueWhenJoined);
  }, [queueWhenJoined]);

  useEffect(() => {
    if (!socket.current) return;

    const socketInstance = socket.current;

    const handleQueueUpdate = (data) => {
      setQueue(data.queue || []);
    };

    const handlePlay = () => {
      const player = playerRef.current;

      if (!player) return;

      const state = player.getPlayerState();

      // States:
      // -1 (unstarted)
      // 0 (ended)
      // 1 (playing)
      // 2 (paused)
      // 3 (buffering)
      // 5 (video cued)

      if (state !== 1) {
        // If not already playing
        player.playVideo();
        setIsPlaying(true);
        socket.current.emit("play-music", roomId); // Add corresponding socket emit
      }
    };

    const handlePause = () => {
      const player = playerRef.current;

      if (!player) return;

      const state = player.getPlayerState();

      if (state === 1) {
        // If currently playing
        player.pauseVideo();
        setIsPlaying(false);
        socket.current.emit("stop-music", roomId);
      }
    };

    socketInstance.on("song-queue-updated", handleQueueUpdate);
    socketInstance.on("play", handlePlay);
    socketInstance.on("pause", handlePause);

    return () => {
      socketInstance.off("song-queue-updated", handleQueueUpdate);
      socketInstance.off("play", handlePlay);
      socketInstance.off("pause", handlePause);
    };
  }, [socket]);

  const requestQueueUpdateToServer = (newQueue) => {
    if (!socket.current || !roomId) return;
    console.log("Sending queue update to server:", newQueue);
    socket.current.emit("request-to-update-queue", {
      roomId,
      queue: newQueue,
    });
  };

  const toastAddedToQueue = () => {
    toast.success("🎵 Song added to queue!", {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const toastRemovedFromQueue = () => {
    toast.warn("🎵 Song removed from queue!", {
      position: "top-right",
      autoClose: 3000,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  };

  const addToQueue = (song) => {
    const newQueue = [...queue, song];
    setQueue(newQueue);
    toastAddedToQueue();
    requestQueueUpdateToServer(newQueue);
  };

  const removeFromQueue = (song_title) => {
    const newQueue = queue.filter((song) => song.snippet.title !== song_title);
    setQueue(newQueue);
    toastRemovedFromQueue();
    requestQueueUpdateToServer(newQueue);
  };

  const toggleIsPlaying = () => {
    const player = playerRef.current;

    if (!player) return;

    const state = player.getPlayerState();

    if (state === 1) {
      player.pauseVideo();
      setIsPlaying(false);
      socket.current.emit("stop-music", roomId);
    } else {
      player.playVideo();
      socket.current.emit("start-music", roomId);
      setIsPlaying(true);
    }
  };

  // Youtube custom controls
  const onReady = (event) => {
    playerRef.current = event.target;
  };

  return (
    <PlayerContext.Provider
      value={{
        queue,
        addToQueue,
        removeFromQueue,
        setQueue,
        isPlaying,
        setIsPlaying,
        toggleIsPlaying,
        onReady,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
export default PlayerContext;
