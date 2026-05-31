const express = require('express');
const controller = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);
router.get('/', controller.getProfile);
router.post('/', controller.createProfile);
router.put('/', controller.updateProfile);
router.delete('/', controller.deleteProfile);

module.exports = router;
