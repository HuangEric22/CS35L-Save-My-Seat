const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Auction = require('../models/auctionModel');
const User = require('../models/userModel');
const Bid = require('../models/bidModel');
const bcrypt = require ('bcrypt')
require('dotenv').config();

const generateToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
  }

  function containsSpecialChars(str) {
    
    const specialCharsPattern = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;

    return specialCharsPattern.test(str);
  }
  const registerUser = async (req, res) => {
    const { name, username, email, password,  major } = req.body;
    

    try {
      const user = await User.signup(name, email, username, major, password)
  console.log("Sign up was working")
      // create a token
      const token = generateToken(user._id)
      console.log("Token generated")
  
      res.status(200).json({
        name: user.name,
        username: user.username,
        email: user.email,
        major: user.major,
        userID: user._id,
         token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
};

const changePassword = async (req,res) => {

    const {oldPassword, newPassword} = req.body
    const {userId} = req.params
    try {
        
        const user = await User.changePassword(userId, oldPassword, newPassword)
        res.status(200).json({userId})
        } catch(error) {
            res.status(400).json({error: error.message})
        }
}

const changeUsername = async (req,res) => {
    const {newUsername} = req.body
    const {userId} = req.params
    try {
        const exists = await User.findOne({_id: userId, username: newUsername})
        if (exists) {
            throw Error("That's already your username")
        }
        /* exists = await this.findOne(userId, {username: newUsername});
        if (exists) {
          throw Error("That's already your username.")
        }*/
        const existsTwo = await User.findOne({username: newUsername});
        if(existsTwo) {
          throw Error('Username already in use');
        }
        await User.findByIdAndUpdate(userId, {username: newUsername });
        res.status(200).json({username: newUsername})}
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const changeName = async (req,res) => {
    const {userId} = req.params
        const {newName} = req.body
    try {
        const user = await User.changeName(userId, newName)
    
    res.status(200).json({name: newName})}
    catch (error) {
        res.status(400).json({error: error.message})
    }
}
const authUser = async(req, res) => {
    const { email, password } = req.body;
    
    

    try {
        const user = await User.login(email, password)
    
        // create a token
        const token = generateToken(user._id)
        const userID = user._id
        const bids = user.bids;
        res.status(200).json({username: user.username, name: user.name, email,userID, bids, token})
      } catch (error) {
        res.status(400).json({error: error.message})
      }
};

const userBids = async (req,res) => {
    
const {userId} = req.params;
    try {
const user = await User.findById(userId);
res.status(200).json(user.bids)
    }
    catch (error) {
        res.status(400).json({error: error.message})
    }
}

const getAuctionOwners = async (auctionIds) => {
    const owners = {};
    for (const auctionId of auctionIds) {
        const auction = await Auction.findById(auctionId);
        if (auction) {
            const owner = await User.findById(auction.ownerId);
            if (owner) {
                owners[auctionId] = owner.name;
            }
        }
    }
    return owners;
};

const getUser = async (req, res) => {
    try {
        const auctions = await Auction.find({});
        const auctionIds = auctions.map(auction => auction._id); // Extract auction IDs
        const owners = await getAuctionOwners(auctionIds); // Get owners' names
        const result = auctionIds.map(auctionId => ({ auctionId, ownerName: owners[auctionId] || 'Unknown' }));
        const indexedResult = {};
        result.forEach(item => {
            indexedResult[item.auctionId] = item.ownerName;
        });

        res.json(indexedResult);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

const getHighestBiddersForAllAuctions = async (req, res) => {
    try {
        // Find all auctions
        const auctions = await Auction.find({});

        // Initialize an object to store the highest bidders for each auction
        const highestBidders = {};

        // Iterate over each auction
        for (const auction of auctions) {
            // Initialize an array to store all bids for this auction
            const allBids = [];

            // Iterate over each bid in the auction
            for (const bid of auction.bids) {
                const foundBid = await Bid.findById(bid._id);
                allBids.push({
                    amount: foundBid.amount,
                    name: foundBid.name,
                    email : foundBid.email
                });
            }

            // Store the array of bids for this auction in the highestBidders object
            highestBidders[auction._id] = allBids.length > 0 ? allBids : [{ amount: auction.startingBid, name: 'No Bids' , email: ''}];
        }

        // Return the result
        res.json(highestBidders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const planClass = async (classId) => {
    
}

module.exports  = {
    authUser, registerUser, getUser, getHighestBiddersForAllAuctions, planClass, userBids, changePassword,
    changeUsername, changeName
}


