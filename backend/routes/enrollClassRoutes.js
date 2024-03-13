const express = require('express');
const router = express.Router();
const {
    enrollClass, getClasses, getSpecificClass, deleteClass
}=require('../controllers/enrollClassController')
const requireAuthent = require('../middleware/requireAuthent');
router.route('/').post(requireAuthent, enrollClass);
router.route('/').get(requireAuthent, getClasses)
router.route('/:classId').get(requireAuthent, getSpecificClass)
router.route('/:classId').delete(requireAuthent, deleteClass)
module.exports = router;