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
  const { socket, roomId, queueWhenJoined } = useRoomContext();
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

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
      console.log("Play event recieved");
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log("Pause event recieved");
      setIsPlaying(false);
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

  const playTheSong = () => {
    setIsPlaying(true);
    socket.current.emit("start-music", roomId);
  };

  const toggleIsPlaying = () => {
    console.log("toggle button clicked");
    if (isPlaying) {
      console.log("pause the song");
      socket.current.emit("stop-music", roomId);
      setIsPlaying(false);
    } else {
      console.log("play the song");
      playTheSong();
    }
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
export default PlayerContext;
