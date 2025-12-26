const express = require('express');
const router = express.Router();
const { getLeaves, applyLeave } = require('../controllers/leaveController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/', staff, getLeaves);
router.post('/apply', staff, applyLeave);

module.exports = router;
