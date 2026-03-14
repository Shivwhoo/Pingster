import dotenv from "dotenv";
dotenv.config()
import { app } from "./app.js";
import connectDB from "./src/db/index.js";
import { createServer } from "http";
import {Server} from "socket.io"


const httpServer=createServer(app);

const io=new Server(httpServer,{
    pingTimeout:60000,
    cors:{
        origin:process.env.CORS_ORIGIN || "http://localhost:5173",
        credentials:true,
    }
})

io.on("connection", (socket) => {
    console.log("⚡ New user connected! Socket ID:", socket.id);

    // 1. SETUP (Login): 
    socket.on("setup", (userData) => {
        socket.join(userData._id); 
        console.log("👤 User joined personal room:", userData._id);
        socket.emit("connected"); 
    });

    // 2. JOIN CHAT (Chat Open Karna): 
    socket.on("join chat", (room) => {
        socket.join(room); // room = chatId
        console.log("👥 User joined Chat Room: " + room);
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

    // 4. DISCONNECT (App Band Karna):
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected");
    });
});
const PORT = process.env.PORT ;

connectDB()
    .then(() => {
        httpServer.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("\n❌ MongoDB connection failed!!! ", err);
    });