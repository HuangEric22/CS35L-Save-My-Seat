const express = require('express');
const router = express.Router();
const {createAuction, createBid, getAuctions, deleteAuction, completeAuction} = require('../controllers/auctionControllers');

router.route('/').post(createAuction);
router.route('/:auctionId').put(createBid);
router.route('/').get(getAuctions);
router.route('/:auctionId').delete(deleteAuction);
router.route('/completed/:auctionId').put(completeAuction);

module.exports = router;