const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema; 
const userSchema = new Schema({
  name:{type:String, required:true}, 
    username:{type:String, required:true, unique: true},
    email:{type:String, required:true, unique:true }, 
    password:{type:String, required:true}, 
    major:{type:String, required:true},
    courses: [{ type: String }],
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }],
    funds:{type:String, default:"1000"}
}, {timestamps: true})



userSchema.statics.signup = async function(name, email, username, major, password) {

    // validation
    if (!name) throw Error("Provide your name.")
if (!email) throw Error("Must provide an email.")
if (!username) throw Error("Must provide a username.")
if (!major) throw Error("Must choose a major.")
if (!password) throw Error("Must provide a password.")

    if (!validator.isEmail(email)) {
      throw Error('Email not valid');
    }
   if (email.lastIndexOf("g.ucla.edu") === -1) {
    throw Error("Must be a UCLA login.")
   }
    // Depending on your requirements, you might want to validate the username and major as well.
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough');
    }
  
    const exists = await this.findOne({email});
  
    if (exists) {
      throw Error('Email already in use');
    }
    const existsTwo = await this.findOne({username});
    if(existsTwo) {
      throw Error('Username already in use');
    }
  
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
  email = email.toLowerCase();
    const user = await this.create({name, username, email,  major, password: hash });
  
    return user;
  };
  
  // static login method remains unchanged
  userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
      throw Error('All fields must be filled');
    }
  email = email.toLowerCase();
    const user = await this.findOne({ email });
    if (!user) {
      throw Error('Incorrect email');
    }
  
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw Error('Incorrect password');
    }
  
    return user;
  };
const User  = mongoose.model("User", userSchema);
module.exports = User;