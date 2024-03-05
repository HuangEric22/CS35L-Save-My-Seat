const express = require('express');
const router = express.Router();
const {createAuction, createBid, getAuctions, deleteAuction, completeAuction, getTimes} = require('../controllers/auctionControllers');
const requireAuthent = ('../middleware/requireAuthent');
router.use(requireAuthent); 
router.route('/').post(createAuction);
router.route('/:auctionId').put(createBid);
router.route('/').get(getAuctions);
router.route('/:auctionId').delete(deleteAuction);
router.route('/completed/:auctionId').put(completeAuction);
router.route('/times').get(getTimes)
module.exports = router;