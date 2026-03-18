import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

// ✅ Multiple origins support (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  "https://pingster-opal.vercel.app",
];

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("⚡ New user connected! Socket ID:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");

    if (!onlineUsers.some((user) => user.userId === userData._id)) {
      onlineUsers.push({ userId: userData._id, socketId: socket.id });
    }

    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId)
    );
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("message deleted", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message deleted", data);
    });
  });

  socket.on("message edited", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message edited", data);
    });
  });

  socket.on("new message", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message received", data);
    });
  });

  socket.on("mark as read", ({ chatId, userId, readByArray }) => {
    socket.in(chatId).emit("messages read", { chatId, userId, readByArray });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    onlineUsers = onlineUsers.filter(
      (user) => user.socketId !== socket.id
    );

    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId)
    );
  });
});

// ✅ Safe PORT fallback
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err);
  });import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

// ✅ Multiple origins support (IMPORTANT)
const allowedOrigins = [
  "http://localhost:5173",
  "https://pingster-opal.vercel.app",
];

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("⚡ New user connected! Socket ID:", socket.id);

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");

    if (!onlineUsers.some((user) => user.userId === userData._id)) {
      onlineUsers.push({ userId: userData._id, socketId: socket.id });
    }

    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId)
    );
  });

  socket.on("join chat", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("message deleted", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message deleted", data);
    });
  });

  socket.on("message edited", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message edited", data);
    });
  });

  socket.on("new message", (data) => {
    if (!data.chat?.users) return;

    data.chat.users.forEach((user) => {
      if (user._id === data.sender._id) return;
      socket.in(user._id).emit("message received", data);
    });
  });

  socket.on("mark as read", ({ chatId, userId, readByArray }) => {
    socket.in(chatId).emit("messages read", { chatId, userId, readByArray });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    onlineUsers = onlineUsers.filter(
      (user) => user.socketId !== socket.id
    );

    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId)
    );
  });
});

// ✅ Safe PORT fallback
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection failed:", err);
  });