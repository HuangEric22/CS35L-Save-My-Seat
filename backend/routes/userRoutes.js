const express = require('express');
const router = express.Router();
const {registerUser, authUser, getUser, getHighestBiddersForAllAuctions } = require('../controllers/userController');

router.route('/').post(registerUser); 
router.route('/login').post(authUser);
router.route('/').get(getUser);
router.route('/highestBidder').get(getHighestBiddersForAllAuctions);
module.exports = router;