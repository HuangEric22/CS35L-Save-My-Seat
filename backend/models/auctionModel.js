const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const Bid = require('./bidModel.js')
const auctionModel = new Schema({
    auctionName:{
        type:String,
        required:true
    }, 
    owner:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User"
    }, 
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }] 

});

const Auction = mongoose.model("Auction", auctionModel);
module.exports = Auction;