const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const nanoid = require("nanoid");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    path: "http://localhost:5173/",
    methods: ["GET", "POST"],
  },
});

let rooms = [];

io.on("connection", (socket) => {
  console.log(socket.id, "Joined");

  socket.on("create-room", (data) => {
    rooms[socket.id] = {
      roomId: nanoid(5),
      name: data.userName,
      isHost: true,
      roomName: data.roomName,
    };
  });
  socket.on("disconnect", () => {
    console.log(socket.id, "Disconnected");
  });
});

app.get("/", (req, res) => {});

httpServer.listen(3000);
