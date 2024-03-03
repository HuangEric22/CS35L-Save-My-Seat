const Auction = require('../models/auctionModel');
const mongoose = require('mongoose');
const Bid = require('../models/bidModel');



function expired_auction(createdAt){
    const current_time = new Date();
    const differenceInMilliseconds = current_time - createdAt;
    const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000;
    return differenceInMilliseconds >= twentyFourHoursInMilliseconds;
}


const createAuction = async (req, res) => {
    try {
        const {auctionName, ownerId, courseName} = req.body;
        
        const auction = new Auction({
            auctionName,
            courseName,
            ownerId,
        });
        await auction.save();
        res.status(201).json(auction);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

const createBid = async (req, res) => {
    const { auctionId } = req.params;
    const { bidderId:bidderID, amount } = req.body;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) 
    {
        res.status(404).send(`No auction with id: ${auctionId}`);
    }
    const auction = await Auction.findById(auctionId);
    if(expired_auction(auction.createdAt) || auction.completed){
        res.stataus(404).send("Auction Expired")
    }
    const bid = new Bid({
        bidderID, 
        amount
    })
    try {
        await bid.save();
        auction.bids.push(bid);
        await auction.save();
        res.status(201).json(auction); //return the auction to the frontend api
    } catch (error) {
        console.log(error)
    }

};

const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({});
        res.status(201).json(auctions); //return the acutinos array to the user 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAuction = async (req, res) => {
    const { auctionId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(auctionId)) {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }
    
    try {
        const auc = await Auction.findById(auctionId);
        
        if (!auc) {
            return res.status(404).send(`No auction with id: ${auctionId}`);
        }
        
        const bid_ids = auc.bids.map(id => id.toString());
        
        const auction = await Auction.findOneAndDelete({ _id: auctionId });
        
        if (!auction) {
            return res.status(404).send(`No auction with id: ${auctionId}`);
        }
        
        const delbids = await Promise.all(bid_ids.map(async id => {
            try {
                return await Bid.findOneAndDelete({ _id: id });
            } catch (error) {
                console.error("Error deleting bid:", error);
                // Handle error if needed
            }
        }));
        
        res.status(201).json({ message: "Auction deleted successfully" });
    } catch (error) {
        console.error("Error deleting auction:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const completeAuction = async (req, res) => {
    const { auctionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) 
    {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }
    const auction = await Auction.findOneAndUpdate(
        { _id: auctionId }, // Query object to find the auction by its ID
        { $set: { completed: true } }, // Update object to set the completed field to true
        { new: true } // Option to return the updated document
    );
    res.status(201).json(auction);
};

module.exports = {
    createAuction, createBid, getAuctions, deleteAuction, completeAuction
}