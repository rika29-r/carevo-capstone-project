const express = require('express');
const controller = require('../controllers/experienceController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getExperiences);
router.get('/:id', controller.getExperienceById);
router.post('/', controller.createExperience);
router.put('/:id', controller.updateExperience);
router.delete('/:id', controller.deleteExperience);

module.exports = router;
