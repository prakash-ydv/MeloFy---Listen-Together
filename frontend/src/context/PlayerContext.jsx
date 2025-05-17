import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

// 1. Create the context
const PlayerContext = createContext();

// 2. Create the provider component
export const PlayerContextProvider = ({ children }) => {
  return <PlayerContext.Provider value={{}}>{children}</PlayerContext.Provider>;
};

// 3. Optional: Custom hook to use RoomContext
export const usePlayerContext = () => useContext(PlayerContext);

// 4. Export the context (fixed typo in name)
export default PlayerContext;
