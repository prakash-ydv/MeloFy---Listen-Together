import React from "react";
import { Users, Badge, Mic2, UserRound } from "lucide-react";
import { useContext } from "react";
import RoomContext from "../../context/RoomContext";

const mockUsers = [
  {
    id: 1,
    name: "Alex",
    isHost: true,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

function UsersBox() {
  const { disConnectToServer } = useContext(RoomContext);


  return (
    <div>
      {/* Sidebar - Users in room */}
      <div className="w-full xl:w-80 bg-black/40 backdrop-blur-md rounded-xl p-6 h-fit border border-white/10 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Users className="h-4 w-4 mr-2 text-purple-400" />
            In This Room
          </h3>
        </div>

        <div className="space-y-3">
          {mockUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
            >
              <div className="center border-2 border-purple-500 group-hover:border-purple-500 transition-colors h-10 w-10 rounded-full ">
                <UserRound />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 ">
                  <span className="font-medium">{user.name}</span>
                  {user.isHost && (
                    <span className="text-xs bg-gradient-to-br from-purple-900 to-indigo-800  px-2  rounded-2xl">
                      Host
                    </span>
                  )}
                </div>
              </div>
              {user.isHost && <Mic2 className="h-4 w-4 text-purple-400" />}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-white/10">
          <button
            onClick={() => disConnectToServer()}
            className="w-full border-white/20 hover:bg-white/10 hover:text-red-400 transition-colors bg-black py-2 rounded-xl cursor-pointer"
          >
            Leave Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default UsersBox;
