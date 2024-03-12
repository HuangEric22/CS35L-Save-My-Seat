const express = require('express');
const router = express.Router();
const {getClasses, enrollClass} = require('../controllers/classController');
const requireAuthent = require('../middleware/requireAuthent');
//router.use(requireAuthent); 

router.route('/').get(requireAuthent, getClasses)
//router.route('/:userId').get(requireAuthent, enrollClass)
module.exports = router;