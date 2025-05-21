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

  const { socket, roomId, queueWhenJoined, isAdmin, userId } = useRoomContext();
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [songDuration, setSongDuration] = useState(0);
  const [currentTimeOfSong, setCurrentTimeOfSong] = useState(0);

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

    const handlePlay = (data) => {
      const player = playerRef.current;
      const { currentDuration } = data;

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
        setCurrentTimeOfSong(currentDuration);
        player.seekTo(currentDuration, true);
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

  // sync song time for new joiner

  useEffect(() => {
    if (!isAdmin) return;

    socket.current.on("get-time-for-new-user", (data) => {
      const { roomId, userId } = data;
      console.log("Get time for new user received");

      const player = playerRef.current;
      if (!player) return;

      const time = player.getCurrentTime(); // Directly from the player
      const isPlaying = player.getPlayerState() === 1; // 1 = playing

      socket.current.emit("get-time-for-new-user-response", {
        roomId,
        userId,
        time,
        isPlaying,
      });
    });

    return () => {
      socket.current.off("get-time-for-new-user");
    };
  }, [userId]);

  useEffect(() => {
    socket.current.on("sync-for-joiner", (data) => {
      console.log("sync request recieved for new joiner");
      const { time, isPlaying } = data;
      console.log("Time ", time, "isPlaying ", isPlaying);

      console.log("Findin Player...");
      const player = playerRef.current;
      if (!player) return;
      console.log("Player Found");

      // Seek first
      player.seekTo(time, true);

      console.log("Seek Done");

      // Then play or pause based on state
      if (isPlaying) {
        player.playVideo();
      } else {
        player.pauseVideo();
      }

      setCurrentTimeOfSong(time);
      setIsPlaying(isPlaying);
    });

    return () => {
      socket.current.off("sync-for-joiner");
    };
  }, [userId]);

  // if Player is not ready then ask again for sync when ready in every 10 seconds to sync perfectly
  useEffect(() => {
    if (!playerRef.current) return;
    if (!roomId || !userId || isAdmin) return;

    socket.current.emit("ask-sync-again", { roomId, userId });

    let numberOfInterval = 0;

    const intervalId = setInterval(() => {
      socket.current.emit("ask-sync-again", { roomId, userId });
      numberOfInterval++;
      console.log("Sync Interval Run");

      // run only two times
      if (numberOfInterval > 2) {
        clearInterval(intervalId);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [playerRef.current]);

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
      socket.current.emit("stop-music", { roomId, currentTimeOfSong });
    } else {
      player.playVideo();
      socket.current.emit("start-music", roomId);
      setIsPlaying(true);
    }
  };

  // Youtube custom controls
  const onReady = (event) => {
    playerRef.current = event.target;
    const duration = event.target.getDuration();
    setSongDuration(duration);

    setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTimeOfSong(time);
      }
    }, 1000);

    return;
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
        songDuration,
        currentTimeOfSong,
        setCurrentTimeOfSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayerContext = () => useContext(PlayerContext);
export default PlayerContext;
