const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const  cors  = require("cors");

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    path: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
});

let rooms = [];
let totalRooms = 0;

function code() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

io.on("connection", (socket) => {
  console.log(socket.id, "Joined");

  socket.on("create-room-request", (data) => {
    console.log(data);

    let roomCode = code();

    // create new room
    (rooms[roomCode] = {
      roomDetails: { roomId: roomCode, roomName: data.roomName },
      currentSong: {
        songID: "",
        currentDuration: "",
        isPaused: false,
      },
      songQueue: [{ songID: "", songName: " " }],

      members: [],
    }),
      // add host to member list
      rooms[roomCode].members.push({
        roomId: socket.id,
        userName: data.userName,
        isHost: true,
        roomName: data.roomName,
      });

    // add to room
    socket.join(roomCode);

    socket.emit("room-created", {
      roomId: roomCode,
    });

    totalRooms++;
    console.log("Room Created");
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

app.get("/", (req, res) => {});

httpServer.listen(3000);
