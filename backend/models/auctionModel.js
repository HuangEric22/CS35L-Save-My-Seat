const mongoose = require('mongoose')
const Schema = mongoose.Schema; 

const auctionSchema = new Schema({
    auctionName:{
        type:String,
        required:true, 
        trim:true
    }, 
    owner:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }, 
    bids:[bidSchema]

})

const Auction = mongoose.model("Auction", auctionModel);
module.exports = Auction;