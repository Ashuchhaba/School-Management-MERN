const express = require('express');
const router = express.Router();
const { getMySalaries } = require('../controllers/salaryController');
const { staff } = require('../middleware/staffMiddleware');

router.get('/mine', staff, getMySalaries);

module.exports = router;