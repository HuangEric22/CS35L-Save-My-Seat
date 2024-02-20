const express = require('express');
const router = express.Router();
const {createAuction, createBid, getAuctions, deleteAuction, completeAuction} = require('../controllers/auctionControllers');

router.route('/').post(createAuction);
router.route('/:auctionId').post(createBid);
router.route('/').get(getAuctions);
router.route('/:auctionId').delete(deleteAuction);
router.route('/:auctionId').put(completeAuction);