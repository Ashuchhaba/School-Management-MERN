const express = require('express');
const router = express.Router();
const {
  getAdmissions,
  getAdmissionById,
  createAdmission,
  updateAdmission,
  deleteAdmission,
  approveAdmission,
  rejectAdmission,
} = require('../controllers/admissionController');

router.route('/').get(getAdmissions).post(createAdmission);
router.route('/:id').get(getAdmissionById).put(updateAdmission).delete(deleteAdmission);
router.route('/approve').post(approveAdmission);
router.route('/reject/:id').post(rejectAdmission);

module.exports = router;
