const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const Bid = require('./bidModel.js')
const auctionModel = new Schema({
    courseName:{
        type:String, 
        required:true
    },
    ownerId:{
        type:String,
        required:true
    }, 
    startingBid:{
        type:String, 
        required:true
    },
    expDays:{
        type:String, 
        required:true
    },
    completed:{
        type: Boolean, 
        default:false
    },
    bids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }]

},  {timestamps: true });

const Auction = mongoose.model("Auction", auctionModel);
module.exports = Auction;