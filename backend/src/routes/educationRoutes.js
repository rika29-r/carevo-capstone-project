const express = require('express');
const controller = require('../controllers/educationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getEducations);
router.get('/:id', controller.getEducationById);
router.post('/', controller.createEducation);
router.put('/:id', controller.updateEducation);
router.delete('/:id', controller.deleteEducation);

module.exports = router;
