const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Corrected `origin`, not `path`
    methods: ["GET", "POST"],
  },
});

let rooms = {};
let totalRooms = 0;

function code() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

io.on("connection", (socket) => {
  console.log(socket.id, "Joined");

  socket.on("create-room-request", (data) => {
    let roomCode = code();

    // Create new room
    rooms[roomCode] = {
      roomDetails: { roomId: roomCode, roomName: data.roomName },
      currentSong: {
        songID: "",
        currentDuration: "",
        isPaused: false,
      },
      songQueue: [{ songID: "", songName: " " }],
      members: [],
    };

    // Add host to member list
    rooms[roomCode].members.push({
      userId: socket.id,
      userName: data.userName,
      isHost: true,
      roomName: data.roomName,
    });

    // Join room
    socket.join(roomCode);

    // Emit room creation info
    socket.emit("room-created", {
      roomId: roomCode,
      roomName: data.roomName,
      members: rooms[roomCode].members,
    });

    totalRooms++;
    console.log("Room Created:", roomCode);
  });

  socket.on("join-room-request", (data) => {
    const { roomCode, userName } = data;

    const room = rooms[roomCode];

    if (room) {
      socket.join(roomCode);

      room.members.push({
        userId: socket.id,
        userName,
        isHost: false,
      });

      socket.emit("added-to-room", {
        roomId: roomCode,
        roomName: room.roomDetails.roomName,
        members: room.members,
      });
      io.to(roomCode).emit("sync-members", room.members);
      console.log(room.members);
      console.log(`${userName} joined room ${roomCode}`);
    } else {
      socket.emit("error", { message: "Room not found." });
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
    // Optional: remove user from rooms if needed
  });
});

app.get("/", (req, res) => {
  res.send("Socket server is running.");
});

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});
