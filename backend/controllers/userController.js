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
    const { major, name, email, password } = req.body;
    if (!major || !name || !email || !password) {
        return res.status(400).send("Please Enter All Fields");
    }
 else if (password !== passwordRepeat) {
        
        return res.status(400).send("Passwords don't match");
      } else if (email.lastIndexOf("@g.ucla.edu") === -1) {
        return res.status(400).send("Email must be a @g.ucla.edu account.");
       
      } else if (!containsSpecialChars(password)) {
        return res.status(400).send("Password must contain at least one special character.");
       
      } else if (password.length < 8) {
        return res.status(400).send("Password must be at least 8 characters long.");
        
      }
    try {
        if (await User.findOne({ email })) {
            return res.status(400).send("User already Registered Under Email");
        }

        const salt = await bcrypt.genSalt(10); // Increased the salt rounds
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            major
        });

        await user.save();
        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            major: user.major,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};

// const registerUser = async(req, res) =>{
//     console.log("register");
//     const {name, email, password} = req.body;
//     if(!name || !email || !password){
//         res.status(400).send("Please Enter All Fields");
//     }
//     if(await User.findOne({email})){
//         res.status(400).send("User already Registered Under Email");
//     }

//     const salt = await bcrypt.genSalt(5)
//     const hashedPassword = await bcrypt.hash(password, salt)

//     const user = new User({
//         name,
//         email, 
//         password: hashedPassword
//     });

//     try {
//         await user.save();
//         res.json({
//             _id:user._id, 
//             name:user.name, 
//             email:user.email,
//             token: generateToken(user._id)
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
const authUser = async(req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send("Please Enter All Fields");
    }

    try {
       //attempt to find email first
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Invalid Email or Password");
        }

        // compare inputted password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid Email or Password");
        }

       
        res.json({
            _id: user._id, 
            name: user.name, 
            email: user.email,
            major: user.major, // include major
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

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
            // Check if the auction has any bids
            if (auction.bids.length > 0) {
                // Since the bids are in reverse chronological order, the highest bid is the first one
                const highestBid = auction.bids[auction.bids.length - 1]; // Get the first bid in the array
                const bid = await Bid.findById(highestBid._id);
                // Store the bidder ID of the highest bid
                highestBidders[auction._id] = [bid.amount, bid.name];
            } else {
                // If there are no bids for the auction, set the highest bidder to 'Unknown'
                highestBidders[auction._id] = ['0', 'No Bids'];
            }
        }

        // Return the result
        res.json(highestBidders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports  = {
    authUser, registerUser, getUser, getHighestBiddersForAllAuctions
}


