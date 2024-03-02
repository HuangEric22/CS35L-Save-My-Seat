const mongoose = require('mongoose');
const User = require('../models/userModel');

const registerUser = async(req, res) =>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400).send("Please Enter All Fields");
    }
    if(await User.findOne({email})){
        res.status(400).send("User already Registered Under Email");
    }
    const user = new User({
        name,
        email, 
        password
    });
    try {
        await user.save();
        res.json({
            _id:user._id, 
            name:user.name, 
            email:user.email
            // token: generateToken(user._id)
        });
        console.log("resgister")
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};

const authUser = async(req, res) => {
    const{email, password} = req.body;
    if(!email || !password){
        res.status(400).send("Please Enter All Fields");
    };
    const user = req.body;
    if(await User.findOne({email, password})){
        res.json({
            _id:user._id, 
            name:user.name, 
            email:user.email,
            // token: generateToken(user._id)
        });
        console.log("login");
    }
    else{
        res.status(400).send("username or password don't match");
    }
};

module.exports  = {
    authUser, registerUser
}


