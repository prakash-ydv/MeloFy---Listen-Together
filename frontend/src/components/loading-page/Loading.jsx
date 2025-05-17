import React, { useContext, useEffect, useState } from "react";
import RoomContext from "../../context/RoomContext";
import { useNavigate } from "react-router-dom";

export default function Loading() {
  const { socket, setRoomId, roomId, createRoom } = useContext(RoomContext);
  const navigate = useNavigate();
  const [isConnectionMade, setIsConnectionMade] = useState(false);

  useEffect(() => {
    socket.current.on("room-created", (data) => {
      let roomID = data.roomId;
      setRoomId(roomID);
      localStorage.setItem("roomCode", data.roomId);
      setIsConnectionMade(true);
      console.log("roomCode saved to localstorage");
    });
  }, [createRoom]);

  useEffect(() => {
    if (!localStorage.getItem("roomCode")) {
      return;
    } else {
      navigate(`/room`);
    }

    return () => {};
  }, [roomId, createRoom, isConnectionMade]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center"></div>
        </div>
        <p className="mt-4 text-white/70">Loading room...</p>
      </div>
    </div>
  );
}
