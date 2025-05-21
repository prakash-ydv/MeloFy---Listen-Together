const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
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
      songQueue: [],
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
        queue: room.songQueue,
        members: room.members,
      });
      io.to(roomCode).emit("sync-members", room.members);
      console.log(room.members);
      console.log(`${userName} joined room ${roomCode}`);
    } else {
      socket.emit("room-not-found", { message: "Room not found." });
    }
  });

  socket.on("request-to-update-queue", (data) => {
    const { roomId, queue } = data;
    const room = rooms[roomId];

    if (room) {
      // Validate queue is an array
      if (Array.isArray(queue)) {
        room.songQueue = queue;
        io.to(roomId).emit("song-queue-updated", { queue: room.songQueue });
      } else {
        console.error("Invalid queue data received:", queue);
      }
    }
  });

  socket.on("start-music", (roomId) => {
    console.log("play event init");
    const room = rooms[roomId];

    if (room) {
      const currentDuration = room.currentSong.currentDuration;
      console.log("Play Event Sent");
      room.currentSong.isPaused = false;
      console.log("play event sent");
      io.to(roomId).emit("play", { currentDuration });
    }
  });

  socket.on("stop-music", (data) => {
    const { roomId, currentTimeOfSong } = data;
    const room = rooms[roomId];

    if (room) {
      room.currentSong.isPaused = true;
      console.log("pause event sent");
      console.log("current time", currentTimeOfSong)
      room.currentSong.currentDuration = currentTimeOfSong;
      io.to(roomId).emit("pause");
    }
  });

  socket.on("leave-room", (roomId) => {
    const room = rooms[roomId];
    if (room) {
      socket.leave(roomId);
      room.members = room.members.filter(
        (member) => member.userId !== socket.id
      );

      const hasHost = room.members.some((member) => member.isHost);
      if (!hasHost && room.members.length > 0) {
        room.members[0].isHost = true;
      }

      if (room.members.length < 1) {
        delete rooms[roomId];
      }
      io.to(roomId).emit("sync-members", room.members);
    }
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("Socket server is running.");
});

httpServer.listen(3000, () => {
  console.log("Server listening on port 3000");
});
