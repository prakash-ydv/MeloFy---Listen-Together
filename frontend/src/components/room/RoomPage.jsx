import React, { useState } from "react";
import RoomNav from "./RoomNav";
import { SkipBack, Play, Pause, SkipForward, Volume2 } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ListMusic, Search, Music } from "lucide-react";
import QueueBox from "./QueueBox";
import SearchBox from "./SearchBox";
import UsersBox from "./UsersBox";
import RoomContext from "../../context/RoomContext";
import { useContext } from "react";
import music_banner from "../../assets/music-banner.jpg";
import YoutubePlayer from "../YoutubePlayer";
import { usePlayerContext } from "../../context/PlayerContext";

function RoomPage() {
  const { isPlaying, toggleIsPlaying, onReady } = usePlayerContext();
  const { roomName } = useContext(RoomContext);
  const { disConnectToServer } = useContext(RoomContext);
  const [liked, setliked] = useState(false);
  const [isSearchActive, setisSearchActive] = useState(false);
  const [queue, setQueue] = useState([]);

  const currentSong = {};
  function togglePlayback() {}
  function toggleSearchToQueue() {
    if (!isSearchActive) return;
    setisSearchActive(false);
  }

  function toggleQueueToSearch() {
    if (isSearchActive) return;
    setisSearchActive(true);
  }
  function inviteFriends() {
    // Implement invite friends functionality
  }

  return (
    <div className="min-h-screen p-5 lg:p-10 bg-gradient-to-br from-purple-900 via-indigo-800 to-black text-white overflow-hidden relative">
      {/* Youtube Player */}
      <YoutubePlayer onReady={onReady} videoId={"97xf5DXyXqg"} />
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main content column */}
          <div className="flex-1">
            <RoomNav numberOfListners={69} inviteFriends={inviteFriends} />

            {/* Now Playing */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-auto relative group">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <img
                    src={currentSong.cover || music_banner}
                    alt={currentSong.title}
                    className="w-full md:w-48 h-48 object-cover  object-left rounded-lg shadow-lg relative z-10 transition-transform group-hover:scale-105"
                  />
                  {isPlaying && (
                    <div className="absolute bottom-2 right-2 bg-black/60 rounded-full p-1 z-20">
                      <div className="flex space-x-1">
                        <div className="w-1 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <div
                          className="w-1 h-3 bg-purple-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-1 h-3 bg-purple-500 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl w-70 font-bold truncate">
                        {currentSong.title || "Add song to play... "}
                      </h2>
                      <p className="text-white/70">{currentSong.artist}</p>
                    </div>
                  </div>

                  <div className="mt-6 relative">
                    <canvas
                      ref={null}
                      width="600"
                      height="60"
                      className="w-full h-[60px] absolute top-[-15px] opacity-50 pointer-events-none"
                    ></canvas>
                    <Slider
                      value={100}
                      max={100}
                      step={1}
                      className="custom-slider"
                    />
                  </div>

                  <div className="flex justify-center items-center gap-4 mt-6">
                    <button className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      <SkipBack className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => toggleIsPlaying()}
                      className="center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14 w-14 rounded-full shadow-lg shadow-purple-900/30 transition-transform hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6 ml-1" />
                      )}
                    </button>
                    <button className="text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                      <SkipForward className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-6 w-35">
                    <Volume2 className="h-4 w-4 text-white/70" />
                    <Slider
                      value={55}
                      max={100}
                      step={1}
                      onChange={() => {}}
                      className="volume-slider"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* queue and search box */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl">
              {/* queue and search button */}
              <div className="center bg-[#190e36] p-2 rounded-2xl text-zinc-400">
                <button
                  onClick={toggleSearchToQueue}
                  className={`w-1/2 h-8 rounded-l-xl cursor-pointer center gap-1 transition-colors ${
                    isSearchActive
                      ? ""
                      : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  }`}
                >
                  <ListMusic size={18} /> Queue
                </button>
                <button
                  onClick={toggleQueueToSearch}
                  className={`w-1/2 h-8 rounded-r-xl cursor-pointer center gap-1 transition-colors ${
                    isSearchActive
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                      : ""
                  }`}
                >
                  <Search size={18} />
                  Search
                </button>
              </div>

              {isSearchActive ? <SearchBox /> : <QueueBox queue={queue} />}
            </div>
          </div>

          {/* UsersBox column - appears on the right on lg screens and above */}
          <div className="xl:w-80 xl:ml-6 xl:mt-0 xl:sticky xl:top-20 xl:self-start xl:h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <UsersBox />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomPage;
