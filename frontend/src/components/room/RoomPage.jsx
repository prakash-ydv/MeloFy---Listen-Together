import React, { useState } from "react";
import RoomNav from "./RoomNav";
import {
  Heart,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Volume2,
} from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { ListMusic, Search } from "lucide-react";

function RoomPage() {
  const [isPlaying, setisPlaying] = useState(true);
  const [liked, setliked] = useState(false);
  const [isSearchActive, setisSearchActive] = useState(true);

  const currentSong = {};
  function togglePlayback() {}
  function toggleSearchToQueue() {
    if (!isSearchActive) return;
    setisSearchActive(false);
  }
  function toggleIsPlaying() {
    setisPlaying((prev) => !prev);
  }
  function toggleQueueToSearch() {
    if (isSearchActive) return;
    setisSearchActive(true);
  }
  return (
    <div className="min-h-screen p-5 lg:p-10 bg-gradient-to-br from-purple-900 via-indigo-800 to-black text-white overflow-hidden relative ">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <RoomNav numberOfListners={69} inviteFriends={() => inviteFriends()} />

      {/* Now Playing */}
      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-xl max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-auto relative group">
            <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <img
              src={currentSong.cover || "/placeholder.svg"}
              alt={currentSong.title}
              className="w-full md:w-48 h-48 object-cover rounded-lg shadow-lg relative z-10 transition-transform group-hover:scale-105"
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
                <h2 className="text-2xl w-3/5 sm:w-1/2 font-bold truncate ">
                  {currentSong.title ||
                    "aal awala kela wala land lele mera dj harish"}
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
                onClick={toggleIsPlaying}
                className="center bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14 w-14 rounded-full shadow-lg shadow-purple-900/30 transition-transform hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </button>
              <button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <SkipForward className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-6 w-35">
              <Volume2 className="h-4 w-4 text-white/70" />
              <Slider
                value={55}
                max={100}
                step={1}
                onChange={""}
                className="volume-slider"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-xl max-w-6xl">
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
      </div>
    </div>
  );
}

export default RoomPage;
