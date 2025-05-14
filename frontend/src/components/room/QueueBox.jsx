import React from "react";
import { Music } from "lucide-react";

function QueueBox(props) {
  const { queue } = props;
  return (
    <div className="w-full p-5 flex flex-col">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Music className="h-4 w-4 mr-2 text-purple-400" />
        Up Next
      </h3>
      <div>
        <section className="h-[300px] pr-4">
          <div className="space-y-2 flex flex-col gap-2">
            {queue.map(() => (
              <div className="center"></div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default QueueBox;
