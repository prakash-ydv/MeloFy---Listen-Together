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
  const [userId, setUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [joinUserName, setJoinUserName] = useState("");
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [isRoomFound, setIsRoomFound] = useState(true);
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
      setUserId(data.userId);
      setIsAdmin(true);
      setIsRoomFound(true);
      localStorage.setItem("roomCode", data.roomId);
      console.log("roomCode saved to localstorage");
    });

    socket.current.on("added-to-room", (data) => {
      setRoomName(data.roomName);
      setRoomId(data.roomId);
      setMembers(data.members);
      setQueueWhenJoined(data.queue);
      setUserId(data.userId);
      setIsRoomFound(true);
      navigate("/room");
      localStorage.setItem("roomCode", data.roomId);
      socket.current.emit("new-user-joined", {
        roomId: data.roomId,
        userId: data.userId,
      });
    });

    socket.current.on("sync-members", (members) => {
      setMembers(() => members);
    });

    socket.current.on("room-not-found", () => {
      setIsRoomFound(false);
    });

    return () => {
      socket.current.off("room-created");
      socket.current.off("added-to-room");
      socket.current.off("sync-members");
    };
  }, [isConnectionMade]);

  function connectToServer() {
    if (!socket.current) {
      socket.current = io("http://localhost:3000/");
      console.log("Connected to server...");

      setIsConnectionMade(true);
    }
  }
  function disConnectToServer() {
    if (!socket.current) return;

    if (roomId) {
      socket.current.emit("leave-room", roomId);
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
        isAdmin,
        userName,
        userId,
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
        isRoomFound,
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
