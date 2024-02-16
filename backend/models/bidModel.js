const mongoose = require('mongoose');
 
const bidModel = mongoose.Schema({
    bidder:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"user",
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