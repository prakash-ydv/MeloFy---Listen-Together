import React from "react";
import { ChevronLeft, Users, Share2 } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import RoomContext from "../../context/RoomContext";

function RoomNav(props) {
  const { roomName, members } = useContext(RoomContext);
  const [listners, setListners] = useState(0);

  useEffect(() => {
    setListners(members.length);

    return () => {
      setListners(0);
    };
  }, []);

  return (
    <nav className="max-w-6xl mb-6 flex items-center justify-between w-full ">
      <div className="flex items-center">
        <button className="mr-2 hover:bg-white/10 p-1.5 rounded-sm">
          <ChevronLeft />
        </button>

        <div>
          <h1 className="text-2xl max-w-40 sm:max-w-60 font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
            {roomName}
          </h1>
          <div className="center max-w-30 gap-1 font-mono text-sm font-semibold rounded-3xl mt-1 bg-white/10">
            <Users size={15} />
            <span>{listners}</span> Listners
          </div>
        </div>
      </div>
      <button
        onClick={props.inviteFriends}
        className="center border-white/20 hover:bg-white/10 group p-3 bg-black rounded-sm cursor-pointer text-sm transition-colors border font-semibold"
      >
        <Share2 className="h-4 w-4 mr-2 group-hover:text-purple-400 transition-colors" />
        Invite Friends
      </button>
    </nav>
  );
}

export default RoomNav;
