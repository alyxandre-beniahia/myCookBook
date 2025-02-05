const express = require('express');
const router = express.Router({ mergeParams: true });  // This is key for accessing params
const { protect } = require('../middlewares/authMiddleware');
const { validateComment } = require('../middlewares/validateMiddleware');
const { createComment, getRecipeComments, deleteComment } = require('../controllers/commentController');

router.post('/', protect, validateComment, createComment);
router.get('/', getRecipeComments);
router.delete('/:id', protect, deleteComment);

module.exports = router;
