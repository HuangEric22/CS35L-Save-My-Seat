const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const auctionRoutes = require('./routes/auctionRoutes')
const userRoutes  = require('./routes/userRoutes')
const cors=require("cors");
const app = express();
dotenv.config();



const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


app.use(cors(corsOptions)) // Use this after the variable declaration
const PORT = process.env.PORT; 
const connectDB = async () => { //connect to database
    try {
        console.log(process.env.MONGO);
        await mongoose.connect(process.env.MONGO);
        console.log("Connected");
    } catch (error) {

        console.error("MongoDB connection error:", error);
    }
};

// app.use('/api/user', userRoutes);
app.use(express.json());
app.use('/api/auction', auctionRoutes);
app.use('/api/user', userRoutes);
connectDB().then(()=> app.listen(process.env.PORT, console.log("Server Started"))) //start the backend server);




