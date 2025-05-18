import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 1. Create the context
const PlayerContext = createContext();

// 2. Create the provider component
export const PlayerContextProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);

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

  function addToQueue(song) {
    console.log(song);
    let newQueue = [...queue];
    newQueue.push(song);
    setQueue(newQueue);
    toastAddedToQueue();
  }

  function removeFromQueue(song_title) {
    const newQueue = queue.filter((song) => song.snippet.title !== song_title);
    setQueue(newQueue);
    toastRemovedFromQueue();
  }
  return (
    <PlayerContext.Provider value={{ queue, addToQueue, removeFromQueue }}>
      {children}
    </PlayerContext.Provider>
  );
};

// 3. Optional: Custom hook to use RoomContext
export const usePlayerContext = () => useContext(PlayerContext);

// 4. Export the context (fixed typo in name)
export default PlayerContext;
