const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getCvData, getChecklist, previewCv, generatePdf, generateDocx } = require('../controllers/cvController');

const router = express.Router();
router.use(authMiddleware);

router.get('/data', getCvData);
router.get('/checklist', getChecklist);
router.post('/preview', previewCv);
router.post('/generate-pdf', generatePdf);
router.post('/generate-docx', generateDocx);

module.exports = router;
