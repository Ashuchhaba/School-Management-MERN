const express = require('express');
const router = express.Router();
const { saveMarks, getMarks, getMyMarks } = require('../controllers/examController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/my-marks', getMyMarks);
router.post('/marks/save', staff, saveMarks);
router.get('/marks', staff, getMarks);

module.exports = router;
