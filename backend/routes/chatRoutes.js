const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
