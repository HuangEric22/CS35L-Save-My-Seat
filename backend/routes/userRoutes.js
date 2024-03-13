const express = require('express');
const router = express.Router();
const {registerUser, authUser, getUser, getHighestBiddersForAllAuctions, planClass , userBids, swap, userFunds} = require('../controllers/userController');
const requireAuthent = require('../middleware/requireAuthent');
//signup route
// router.post('/', registerUser);
router.route('/signup').post(registerUser); 
router.post('/login', authUser);
//router.route('/login').post(authUser);
router.route('/').get(requireAuthent, getUser);
router.route('/highestBidder').get( requireAuthent, getHighestBiddersForAllAuctions);
router.route('/swap').put( requireAuthent, swap);
router.route('/:classId').put(requireAuthent, planClass);
router.route('/bids/:userId').get(requireAuthent, userBids)
router.route('/funds/:userId').get(requireAuthent, userFunds)
module.exports = router;