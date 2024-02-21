const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const registerUser = async(req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400).send("Please Enter All Fields");
    }
    if(await User.findone({email})){
        res.status(400).send("User already Registered Under Email");
    }
    const user = new User({
        name,
        email, 
        password
    });
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const authUser = async(req, res) => {
    
}