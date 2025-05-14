import { MusicIcon, Users, Headphones } from "lucide-react";
import React, { createElement, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [createUserName, setCreateUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joinUserName, setJoinUserName] = useState("");

  function createRoom(e) {
    e.preventDefault();
    // create room logic
    setRoomName("");
    setCreateUserName("");
    navigate('/loading')
  }
  function joinRoom(e) {
    e.preventDefault();
    // create room logic
    setRoomCode("");
    setJoinUserName("");
    navigate('/loading')
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black text-white overflow-hidden relative">
      {/* Animated background circles - optimized for viewport */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="h-full flex items-center justify-center px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* Compact header section */}
          <div className="flex flex-col items-center mb-6 sm:mb-8 animate-fadeIn">
            <div className="relative mb-4">
              <div
                className="absolute inset-0 bg-purple-500/30 rounded-full blur-md animate-ping opacity-75"
                style={{ animationDuration: "3s" }}
              ></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 p-2 sm:p-3 rounded-full">
                <MusicIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
              MelodiFy : Listen Together
            </h1>
          </div>

          {/* Compact forms section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Create Room Card */}
            <div className="bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-purple-600 to-indigo-700 p-1.5 rounded-full shadow-lg">
                <Headphones className="h-4 w-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                Create Room
              </h2>
              <form
                onSubmit={(e) => createRoom(e)}
                className="space-y-2 sm:space-y-3"
              >
                <input
                  required
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  type="text"
                  placeholder="Room Name"
                  spellCheck={false}
                  className="w-full h-8 sm:h-9 px-2 sm:px-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 
                  rounded-md focus:border-purple-500 transition-all text-sm sm:text-base"
                />
                <input
                  required
                  value={createUserName}
                  onChange={(e) => setCreateUserName(e.target.value)}
                  type="text"
                  placeholder="Your Name"
                  spellCheck={false}
                  className="w-full h-8 sm:h-9 px-2 sm:px-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 
                  rounded-md focus:border-purple-500 transition-all text-sm sm:text-base"
                />
                <input
                  type="submit"
                  value={"Create Room"}
                  className="w-full h-8 sm:h-9 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none shadow-lg shadow-purple-900/30 text-sm sm:text-base cursor-pointer"
                />
              </form>
            </div>

            {/* Join Room Card */}
            <div className="bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border border-white/10 hover:border-purple-500/50 transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">
                Join Room
              </h2>
              <form
                onSubmit={(e) => joinRoom(e)}
                className="space-y-2 sm:space-y-3"
              >
                <input
                  required
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  spellCheck={false}
                  type="text"
                  placeholder="Room Code"
                  className="w-full h-8 sm:h-9 px-2 sm:px-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 
                  rounded-md focus:border-purple-500 transition-all text-sm sm:text-base"
                />
                <input
                  value={joinUserName}
                  onChange={(e) => setJoinUserName(e.target.value)}
                  spellCheck={false}
                  type="text"
                  placeholder="Your Name"
                  className="w-full h-8 sm:h-9 px-2 sm:px-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 
                  rounded-md focus:border-purple-500 transition-all text-sm sm:text-base"
                />

                <input
                  type="submit"
                  value={"Join Room"}
                  className="w-full h-8 sm:h-9 rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border-none shadow-lg shadow-purple-900/30 text-sm sm:text-base cursor-pointer"
                />
              </form>
            </div>
          </div>

          {/* Compact user count */}
          <div className="mt-4 sm:mt-6 flex justify-center items-center text-xs sm:text-sm text-white/70 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md w-fit mx-auto">
            <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 text-purple-400" />
            <span>1,245 active listeners</span>
          </div>
        </div>
      </div>
    </div>
  );
}
