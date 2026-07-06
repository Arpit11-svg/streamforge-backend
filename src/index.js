import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from "express";

dotenv.config();
// console.log(process.env.MONGODB_URI);
connectDB()

const app=express()
