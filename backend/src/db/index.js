import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`\n MONGO DB CONNECTED SUCCESSFULLY ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Mongo db connection error : ${error}`)
        process.exit(1);
    }
}


export default connectDB;
