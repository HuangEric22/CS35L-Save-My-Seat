const mongoose = require('mongoose');
const Schema = mongoose.Schema; 
const bidModel =  new Schema({
    bidderID:{
        type:String,
        required:true
    }, 
    amount:{
        type:String, trim:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Bid  = mongoose.model('Bid', bidModel);
module.exports = Bid;