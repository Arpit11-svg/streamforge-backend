import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI.replace('/?', `/${DB_NAME}?`);
        const connectionInstance = await mongoose.connect(uri);
        console.log(`\n MongoDB Connected Successfully! DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {
        console.log("MongoDb connection FAILED: ", error);
        process.exit(1)
    }
}

export default connectDB;