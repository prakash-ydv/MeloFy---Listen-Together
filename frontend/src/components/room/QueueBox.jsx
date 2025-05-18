import React from "react";
import { Music, Play, Minus } from "lucide-react";
import { usePlayerContext } from "../../context/PlayerContext";

function QueueBox() {
  const { queue, removeFromQueue } = usePlayerContext();
  return (
    <div className="w-full px-5 py-3 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Music className="h-4 w-4 mr-2 text-purple-400" />
        Up Next
      </h3>
      <div>
        <section className="h-[300px] pr-4">
          <div className="space-y-2 flex flex-col gap-2">
            {queue.map((song, index) => (
              <>
                <div className="flex w-full justify-between items-center">
                  <div
                    key={index}
                    className=" flex w-full  items-center gap-5 p-3 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20 group"
                  >
                    <div className="flex max-w-50 sm:max-w-90">
                      <h4 className="font-medium truncate">
                        {song.snippet.title}
                      </h4>
                    </div>
                  </div>

                  <button
                    title="remove from queue"
                    className="h-8 w-8 center rounded-full bg-purple-600/20 opacity-100 cursor-pointer hover:bg-purple-600 transition-colors duration-300"
                    onClick={() => removeFromQueue(song.snippet.title)}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default QueueBox;
