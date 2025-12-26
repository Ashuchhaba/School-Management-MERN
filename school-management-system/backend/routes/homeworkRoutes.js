const express = require('express');
const router = express.Router();
const { getHomeworks, createHomework } = require('../controllers/homeworkController');
const { staff } = require('../middleware/staffMiddleware');

router.route('/').get(staff, getHomeworks).post(staff, createHomework);

module.exports = router;
