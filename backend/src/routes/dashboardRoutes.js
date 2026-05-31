
const express = require('express');
const { getDashboardSummary, getDashboardCompleteness } = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);
router.get('/completeness', authMiddleware, getDashboardCompleteness);

module.exports = router;
