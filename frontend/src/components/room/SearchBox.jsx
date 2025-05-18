import React, { useEffect, useState } from "react";
import { Search, Play, Plus } from "lucide-react";
import getSearchData from "../../../api/getSearchData";
import { usePlayerContext } from "../../context/PlayerContext";

function SearchBox() {
  const { addToQueue } = usePlayerContext();
  const [searchResults, setSearchResults] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetched, setIsFetched] = useState(false);

  async function searchForSong(e) {
    e.preventDefault();
    setIsFetched(false);
    const data = await getSearchData(searchQuery);
    setSearchResults(data.items);
  }

  useEffect(() => {
    setIsFetched(true);
    return () => {};
  }, [searchQuery]);

  return (
    <div className="mt-5 center flex-col w-full">
      <div className="mb-4 w-full ">
        <form onSubmit={(e) => searchForSong(e)} className="relative center ">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <input
            type="text"
            placeholder="Search for songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-8 pl-10 bg-white/10 text-white placeholder:text-white/50 focus:border-purple-500 transition-all rounded-l-2xl outline-none focus:outline-none"
          />
          <input
            className="bg-black cursor-pointer py-1 px-2 rounded-r-xl"
            type="submit"
            value={"Search"}
          />
        </form>
      </div>

      <section className="h-[300px] w-full pr-4">
        <div className="space-y-2 ">
          {searchResults.length > 0 && setIsFetched ? (
            searchResults.map((song, index) => (
              <>
                <div
                  key={index}
                  className="flex w-full justify-between items-center"
                >
                  <div className=" flex w-full  items-center gap-5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 group">
                    <div className="relative flex gap-1 min-w-5 sm:min-w-32">
                      <img
                        src={
                          song.snippet.thumbnails.medium.url ||
                          "/placeholder.svg"
                        }
                        alt={song.title}
                        className=" h-12 rounded shadow-md transition-transform group-hover:scale-105"
                      />
                      <div className="absolute w-21 inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 rounded transition-opacity">
                        <Play className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex max-w-50 sm:max-w-70">
                      <h4 className="font-medium truncate">
                        {song.snippet.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    title="add to queue"
                    className="h-8 w-8 center rounded-full bg-purple-600/20 opacity-100 cursor-pointer hover:bg-purple-600 transition-colors duration-300"
                    onClick={() => addToQueue(song)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </>
            ))
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
