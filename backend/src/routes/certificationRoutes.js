const express = require('express');
const controller = require('../controllers/certificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getCertifications);
router.get('/:id', controller.getCertificationById);
router.post('/', controller.createCertification);
router.put('/:id', controller.updateCertification);
router.delete('/:id', controller.deleteCertification);

module.exports = router;
