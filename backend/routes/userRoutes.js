const express = require('express');
const { explore, likeUser, dislikeUser, getMatches } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/explore', protect, explore);
router.post('/:id/like', protect, likeUser);
router.post('/:id/dislike', protect, dislikeUser);
router.get('/matches', protect, getMatches);

module.exports = router;
