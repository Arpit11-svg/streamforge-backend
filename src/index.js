import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js"

dotenv.config({
    path: './.env'
});


connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`🚀 StreamForge Backend Started on PORT: ${process.env.PORT}`);
            console.log(`(for Debug: it should be random mostly) PID: ${process.pid}\n`);
        })
    })
    .catch((error) => {
        console.log("MongoDB connection failed ! ", error);;

    })

