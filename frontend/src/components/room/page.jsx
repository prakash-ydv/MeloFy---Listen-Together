import React, { useState, useEffect, useRef } from "react";
import { Avatar, Button, Input, Slider, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Tabs, TabsContent, TabsList, TabsTrigger, ScrollArea, Badge } from "@/components/ui";
import { Heart, ListMusic, Mic2, MoreHorizontal, Pause, Play, SkipBack, SkipForward, Volume2, Search, Plus, Users, Share2, Music, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for songs
const mockSongs = [
  {
    id: 1,
    title: "Blinding Lights",
    artist: "The Weeknd",
    duration: "3:20",
    cover: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    title: "Save Your Tears",
    artist: "The Weeknd",
    duration: "3:35",
    cover: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    title: "Stay",
    artist: "The Kid LAROI, Justin Bieber",
    duration: "2:57",
    cover: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 4,
    title: "good 4 u",
    artist: "Olivia Rodrigo",
    duration: "2:58",
    cover: "/placeholder.svg?height=60&width=60",
  },
  { id: 5, title: "Levitating", artist: "Dua Lipa", duration: "3:23", cover: "/placeholder.svg?height=60&width=60" },
];

// Mock data for users in room
const mockUsers = [
  { id: 1, name: "Alex", isHost: true, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 2, name: "Taylor", isHost: false, avatar: "/placeholder.svg?height=40&width=40" },
  { id: 3, name: "Jordan", isHost: false, avatar: "/placeholder.svg?height=40&width=40" },
];

export default function RoomPage({ roomId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(mockSongs[0]);
  const [queue, setQueue] = useState(mockSongs.slice(1, 3));
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);

  // Audio visualization
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Mock search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    // Filter songs based on search query
    const results = mockSongs.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(results.slice(0, 5));
  }, [searchQuery]);

  // Mock playback progress
  useEffect(() => {
    let interval;

    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio visualization effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const drawVisualization = () => {
      ctx.clearRect(0, 0, width, height);

      if (!isPlaying) {
        // Draw flat line when not playing
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      // Draw waveform visualization
      const barCount = 60;
      const barWidth = width / barCount;
      const barGap = 2;

      for (let i = 0; i < barCount; i++) {
        // Generate random heights for visualization
        const barHeight = Math.sin(i * 0.15 + currentTime * 0.05) * 20 + Math.random() * 15;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(0, height / 2 - barHeight, 0, height / 2 + barHeight);
        gradient.addColorStop(0, "rgba(168, 85, 247, 0.8)");
        gradient.addColorStop(1, "rgba(79, 70, 229, 0.4)");

        ctx.fillStyle = gradient;
        ctx.fillRect(i * (barWidth + barGap), height / 2 - barHeight, barWidth, barHeight * 2);
      }

      animationRef.current = requestAnimationFrame(drawVisualization);
    };

    drawVisualization();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const addToQueue = (song) => {
    setQueue((prev) => [...prev, song]);
  };

  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-black text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* done */}

      <div className="container mx-auto p-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center">
                <Link to="/">
                  <Button variant="ghost" size="icon" className="mr-2 hover:bg-white/10">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">{`Room: ${roomId}`}</h1>
                  <div className="flex items-center mt-1">
                    <Badge variant="outline" className="text-xs bg-purple-600/20 border-purple-600/30">
                      <Users className="h-3 w-3 mr-1" />
                      {mockUsers.length} Listeners
                    </Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="border-white/20 hover:bg-white/10 group">
                <Share2 className="h-4 w-4 mr-2 group-hover:text-purple-400 transition-colors" />
                Invite Friends
              </Button>
            </div>

            {/* done */}

            {/* Now Playing */}
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/10 shadow-xl">
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
                      <h2 className="text-2xl font-bold">{currentSong.title}</h2>
                      <p className="text-white/70">{currentSong.artist}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`${liked ? "text-pink-500" : "text-white/70 hover:text-white"} transition-colors`}
                      onClick={toggleLike}
                    >
                      <Heart
                        className={`h-5 w-5 ${liked ? "fill-pink-500" : ""} transition-all ${liked ? "scale-110" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="mt-6 relative">
                    <canvas
                      ref={canvasRef}
                      width="600"
                      height="60"
                      className="w-full h-[60px] absolute top-[-15px] opacity-50 pointer-events-none"
                    ></canvas>
                    <Slider
                      value={[currentTime]}
                      max={100}
                      step={1}
                      className="w-full [&>span:first-child]:h-1.5 [&>span:first-child]:bg-white/20 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&_[role=slider]]:shadow-md [&_[role=slider]]:shadow-purple-900/50 [&>span:first-child_span]:bg-gradient-to-r [&>span:first-child_span]:from-purple-500 [&>span:first-child_span]:to-indigo-500"
                    />
                    <div className="flex justify-between text-sm text-white/70 mt-1">
                      <span>
                        {Math.floor(
                          (currentTime / 100) * parseInt(currentSong.duration.split(":")[0]) * 60 +
                            parseInt(currentSong.duration.split(":")[1]),
                        )
                          .toString()
                          .padStart(2, "0")}
                        :
                        {(
                          ((currentTime / 100) * parseInt(currentSong.duration.split(":")[0]) * 60 +
                            parseInt(currentSong.duration.split(":")[1])) %
                          60
                        )
                          .toFixed(0)
                          .toString()
                          .padStart(2, "0")}
                      </span>
                      <span>{currentSong.duration}</span>
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button
                      onClick={togglePlayback}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-14 w-14 rounded-full shadow-lg shadow-purple-900/30 transition-transform hover:scale-105"
                    >
                      {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 mt-6">
                    <Volume2 className="h-4 w-4 text-white/70" />
                    <Slider
                      value={volume}
                      max={100}
                      step={1}
                      onValueChange={setVolume}
                      className="w-28 [&>span:first-child]:h-1 [&>span:first-child]:bg-white/20 [&_[role=slider]]:h-3 [&_[role=slider]]:w-3 [&_[role=slider]]:border-0 [&_[role=slider]]:bg-white [&>span:first-child_span]:bg-gradient-to-r [&>span:first-child_span]:from-purple-500 [&>span:first-child_span]:to-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            

            {/* Tabs for Queue and Search */}
            <Tabs
              defaultValue="queue"
              className="bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 shadow-xl"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/40">
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 transition-all"
                >
                  <ListMusic className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-indigo-600 transition-all"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="mt-0">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Music className="h-4 w-4 mr-2 text-purple-400" />
                  Up Next
                </h3>
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {queue.map((song, index) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 group"
                      >
                        <div className="relative">
                          <img
                            src={song.cover || "/placeholder.svg"}
                            alt={song.title}
                            className="w-12 h-12 rounded shadow-md transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded transition-opacity">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{song.title}</h4>
                          <p className="text-sm text-white/70 truncate">{song.artist}</p>
                        </div>
                        <div className="text-sm text-white/70">{song.duration}</div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                            <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                              Remove from queue
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                              Play next
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="search" className="mt-0">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <Input
                      type="text"
                      placeholder="Search for songs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>

                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 group"
                        >
                          <div className="relative">
                            <img
                              src={song.cover || "/placeholder.svg"}
                              alt={song.title}
                              className="w-12 h-12 rounded shadow-md transition-transform group-hover:scale-105"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded transition-opacity">
                              <Play className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{song.title}</h4>
                            <p className="text-sm text-white/70 truncate">{song.artist}</p>
                          </div>
                          <div className="text-sm text-white/70">{song.duration}</div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => addToQueue(song)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : searchQuery ? (
                      <div className="text-center py-8 text-white/50">No results found for "{searchQuery}"</div>
                    ) : (
                      <div className="text-center py-8 text-white/50 flex flex-col items-center">
                        <Search className="h-12 w-12 mb-4 text-white/20" />
                        <p>Search for songs to add to the queue</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Users in room */}
          <div className="w-full lg:w-80 bg-black/40 backdrop-blur-md rounded-xl p-6 h-fit border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Users className="h-4 w-4 mr-2 text-purple-400" />
                In This Room
              </h3>
              <Badge variant="outline" className="bg-purple-600/20 border-purple-600/30">
                {mockUsers.length}
              </Badge>
            </div>

            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
                >
                  <Avatar className="border-2 border-transparent group-hover:border-purple-500 transition-colors">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-700">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{user.name}</span>
                      {user.isHost && (
                        <Badge className="ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs border-none">
                          Host
                        </Badge>
                      )}
                    </div>
                  </div>
                  {user.isHost && <Mic2 className="h-4 w-4 text-purple-400" />}
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                className="w-full border-white/20 hover:bg-white/10 hover:text-red-400 transition-colors"
              >
                Leave Room
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}