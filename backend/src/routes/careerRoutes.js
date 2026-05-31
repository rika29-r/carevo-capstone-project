const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCategories, getKeywords, recommendCareer, importKeywords } = require('../controllers/careerController');

const router = express.Router();
router.use(authMiddleware);

router.get('/categories', getCategories);
router.get('/keywords', getKeywords);
router.post('/recommendation', recommendCareer);
router.post('/import-keywords', importKeywords);

module.exports = router;
