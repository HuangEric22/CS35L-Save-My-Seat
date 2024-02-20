const Auction = require('../models/auctionModel');
const mongoose = require('mongoose');

const createAuction = async (req, res) => {
    try {
        const { auctionName, owner, bids } = req.body;
        const auction = new Auction({
            auctionName,
            owner,
            bids
        });
        await auction.save();
        res.status(201).json(auction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createBid = async (req, res) => {
    const { auctionId } = req.params;
    const { bidder, amount } = req.body;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) 
    {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }
    const auction = await Auction.findById(auctionId);
    auction.bids.push({bidder, amount});
    await auction.save();
    res.status(201).json(auction);
};

const getAuctions = async (req, res) => {
    try {
        const auctions = await Auction.find({});
        res.status(201).json(auctions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteAuction = async (req, res) => {
    const { auctionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) 
    {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }
    const auction = await Auction.findOneAndDelete({_auctionId: auctionId});

    if (!auction)
    {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }

    res.status(201).json({message: "Auction deleted successfully"});
};

const completeAuction = async (req, res) => {
    const { auctionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(auctionId)) 
    {
        return res.status(404).send(`No auction with id: ${auctionId}`);
    }
    const auction = await Auction.findOneAndUpdate({_auctionId: auctionId}, {completed: true}, {new: true});
    res.status(201).json(auction);
};

module.exports = {
    createAuction, createBid, getAuctions, deleteAuction, completeAuction
}
