const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();

const PORT = process.env.PORT; 
const connectDB = async () => {
    try {
        console.log(process.env.MONGO);
        await mongoose.connect(process.env.MONGO);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

connectDB();

app.listen(process.env.PORT, console.log("Server Started"));
