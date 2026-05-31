const express = require('express');
const controller = require('../controllers/languageController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getLanguages);
router.get('/:id', controller.getLanguageById);
router.post('/', controller.createLanguage);
router.put('/:id', controller.updateLanguage);
router.delete('/:id', controller.deleteLanguage);

module.exports = router;
