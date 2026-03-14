import dotenv from "dotenv";
dotenv.config()
import { app } from "./app.js";
import connectDB from "./src/db/index.js";



const PORT = process.env.PORT ;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`\n🚀 Server is running on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("\n❌ MongoDB connection failed!!! ", err);
    });