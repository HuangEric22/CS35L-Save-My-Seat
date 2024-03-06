const express = require('express');
const router = express.Router();
const {registerUser, authUser, getUser, getHighestBiddersForAllAuctions } = require('../controllers/userController');

//signup route
// router.post('/', registerUser);
router.route('/').post(registerUser); 
router.post('/login', authUser);
//router.route('/login').post(authUser);
router.route('/').get(getUser);
router.route('/highestBidder').get(getHighestBiddersForAllAuctions);
module.exports = router;