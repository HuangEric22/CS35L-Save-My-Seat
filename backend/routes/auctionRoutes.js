const express = require('express');
const router = express.Router();

router.route('/').post(createAuction);
router.route('/:auctionId').post(createBid);
router.route('/').get(getAuctions);
router.route('/:auctionId').delete(deleteAuction);
router.route('/:auctionId').put(completeAuction);