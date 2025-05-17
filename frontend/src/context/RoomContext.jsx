import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

// 1. Create the context
const RoomContext = createContext();

// 2. Create the provider component
export const RoomContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("room-created", (data) => {
      let roomID = data.roomId;
      setRoomId(roomID);
      localStorage.setItem("roomCode", data.roomId);
      console.log("roomCode saved to localstorage");
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  function connectToServer() {
    if (!socket.current) {
      socket.current = io("http://localhost:3000/");
      console.log("Connected to server...");
    }
  }
  function disConnectToServer() {
    if (!socket.current) {
      return;
    } else {
      socket.current.disconnect();
      localStorage.setItem("roomCode", "");
      navigate("/");
    }
  }

  function createRoom(e) {
    e.preventDefault();
    if (!socket.current) connectToServer();
    socket.current.emit("create-room-request", { roomName, userName });
    setRoomName("");
    setUserName("");
    navigate("/loading");
  }

  return (
    <RoomContext.Provider
      value={{
        roomId,
        setRoomId,
        roomName,
        setRoomName,
        userName,
        setUserName,
        createRoom,
        connectToServer,
        disConnectToServer,
        socket,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

// 3. Optional: Custom hook to use RoomContext
export const useRoomContext = () => useContext(RoomContext);

// 4. Export the context (fixed typo in name)
export default RoomContext;
