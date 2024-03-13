const express = require('express');
const router = express.Router();
const {getDict} = require('../controllers/classController');
const requireAuthent = require('../middleware/requireAuthent');

router.route('/').get(requireAuthent, getDict)
module.exports = router;