import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN, // https://pingster-opal.vercel.app
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true // Sometimes needed for compatibility
});

// 🔥 NAYA: Online users track karne ke liye array
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("⚡ New user connected! Socket ID:", socket.id);

  // 1. SETUP (Login):
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("👤 User joined personal room:", userData._id);
    socket.emit("connected");

    // 🔥 NAYA: Add user to online list
    if (!onlineUsers.some((user) => user.userId === userData._id)) {
      onlineUsers.push({ userId: userData._id, socketId: socket.id });
    }
    // Sabhi connected clients ko update bhejo
    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId),
    );
  });

  // 2. JOIN CHAT (Chat Open Karna):
  socket.on("join chat", (room) => {
    socket.join(room); // room = chatId
    console.log("👥 User joined Chat Room: " + room);
  });
  // 🔥 NAYA: Humne aage ek aur 'room' add kar diya taaki frontend ko ID mil sake
  socket.on("typing", (room) => socket.in(room).emit("typing", room));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing", room));

  socket.on("message deleted", (deletedMessageInfo) => {
    var chat = deletedMessageInfo.chat;
    if (!chat.users)
      return console.log("⚠️ chat.users not defined in deleted message");

    chat.users.forEach((user) => {
      if (user._id === deletedMessageInfo.sender._id) return;
      socket.in(user._id).emit("message deleted", deletedMessageInfo);
    });
  });

  socket.on("message edited", (editedMessageInfo) => {
    var chat = editedMessageInfo.chat;
    if (!chat.users)
      return console.log("⚠️ chat.users not defined in edited message");

    chat.users.forEach((user) => {
      if (user._id === editedMessageInfo.sender._id) return;
      socket.in(user._id).emit("message edited", editedMessageInfo);
    });
  });

  // 3. NEW MESSAGE (Live Message Bhejna):
  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if (!chat.users) return console.log("⚠️ chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  // 🔥 NAYA: Live Read Receipts
  socket.on("mark as read", ({ chatId, userId, readByArray }) => {
    // Saamne wale user ko batao ki isne padh liya hai
    socket.in(chatId).emit("messages read", { chatId, userId, readByArray });
  });
  // 4. DISCONNECT (App Band Karna):
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    // 🔥 NAYA: Remove user from online list when they close the app
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit(
      "get-online-users",
      onlineUsers.map((u) => u.userId),
    );
  });
});

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`\n🚀 Server is running on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("\n❌ MongoDB connection failed!!! ", err);
  });
