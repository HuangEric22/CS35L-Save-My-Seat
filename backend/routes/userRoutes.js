const express = require('express');
const router = express.Router();
const {registerUser, authUser, allUsers } = require('../controllers/userControllers');

router.post('/', registerUser); 
router.post('/login', authUser);

module.exports = router;