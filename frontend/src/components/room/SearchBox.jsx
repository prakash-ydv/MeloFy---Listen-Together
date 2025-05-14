import React, { useState } from "react";
import { Search } from "lucide-react";

function SearchBox() {
  const [searchResults, setsearchResults] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="mt-5 center flex-col w-full">
      <div className="mb-4 w-full ">
        <form className="relative center ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            placeholder="Search for songs..."
            value={""}
            onChange={""}
            className="w-full h-8 pl-10 bg-white/10 text-white placeholder:text-white/50 focus:border-purple-500 transition-all rounded-l-2xl outline-none focus:outline-none"
          />
          <input className="bg-black cursor-pointer py-1 px-2 rounded-r-xl" type="submit"value={"Search"} />
        </form>
      </div>

      <section className="h-[300px] pr-4">
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
                  <p className="text-sm text-white/70 truncate">
                    {song.artist}
                  </p>
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
            <div className="text-center py-8 text-white/50">
              No results found for "{searchQuery}"
            </div>
          ) : (
            <div className="text-center py-8 text-white/50 flex flex-col items-center">
              <Search className="h-12 w-12 mb-4 text-white/20" />
              <p>Search for songs to add to the queue</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default SearchBox;
