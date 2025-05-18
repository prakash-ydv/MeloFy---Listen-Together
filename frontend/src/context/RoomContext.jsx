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
  const [joinUserName, setJoinUserName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isConnectionMade, setIsConnectionMade] = useState(false);
  const [members, setMembers] = useState(null);
  const [queueWhenJoined, setQueueWhenJoined] = useState([]);

  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) return;
    socket.current.on("room-created", (data) => {
      let roomID = data.roomId;
      console.log(roomID);
      setRoomId(roomID);
      setRoomName(data.roomName);
      setMembers(data.members);
      console.log(data.members);
      localStorage.setItem("roomCode", data.roomId);
      console.log("roomCode saved to localstorage");
    });

    socket.current.on("added-to-room", (data) => {
      setRoomName(data.roomName);
      setMembers(data.members);
      setQueueWhenJoined(data.queue);
      navigate("/room");
      localStorage.setItem("roomCode", data.roomId);
    });

    socket.current.on("sync-members", (members) => {
      setMembers(members);
    });

    return () => {};
  }, [isConnectionMade]);

  function connectToServer() {
    if (!socket.current) {
      socket.current = io("http://localhost:3000/");
      console.log("Connected to server...");

      setIsConnectionMade(true);
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

  function joinRoom(e) {
    e.preventDefault();
    if (!socket.current) connectToServer();
    socket.current.emit("join-room-request", {
      userName: joinUserName,
      roomCode: joinRoomCode,
      isHost: false,
    });
    setJoinRoomCode("");
    setJoinUserName("");
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
        joinUserName,
        joinRoomCode,
        setJoinRoomCode,
        setJoinUserName,
        joinRoom,
        queueWhenJoined,
        members,
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
