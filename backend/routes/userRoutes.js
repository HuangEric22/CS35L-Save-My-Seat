const express = require('express');
const router = express.Router();
const {registerUser, authUser, getUser, getHighestBiddersForAllAuctions, planClass , userBids,
    changePassword, changeUsername, changeName

} = require('../controllers/userController');
const requireAuthent = require('../middleware/requireAuthent');
//signup route
// router.post('/', registerUser);
router.route('/signup').post(registerUser); 
router.post('/login', authUser);
router.route('/password/:userId').put(requireAuthent, changePassword)
router.route('/username/:userId').put(requireAuthent, changeUsername)
router.route('/name/:userId').put(requireAuthent, changeName)
//router.route('/login').post(authUser);
router.route('/').get(requireAuthent, getUser);
router.route('/highestBidder').get( requireAuthent, getHighestBiddersForAllAuctions);
router.route('/:classId').put(requireAuthent, planClass);
router.route('/bids/:userId').get(requireAuthent, userBids)
module.exports = router;