const express = require('express');
const { register, login, me, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/me', protect, upload.single('avatar'), updateProfile);

module.exports = router;
