const express = require('express');
const controller = require('../controllers/skillController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getSkills);
router.get('/:id', controller.getSkillById);
router.post('/', controller.createSkill);
router.post('/bulk', controller.bulkCreateSkills);
router.put('/:id', controller.updateSkill);
router.delete('/:id', controller.deleteSkill);

module.exports = router;
