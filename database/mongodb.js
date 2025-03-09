import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if(!process.env.MONGO_URI) {
    throw new Error("Please provide a MongoDB URI");
}

const connectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
        
    } catch (error) {
        console.error(error);
    }
}

export default connectDB;