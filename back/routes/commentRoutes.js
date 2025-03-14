const express = require('express');
const router = express.Router({ mergeParams: true });  // This is key for accessing params
const { protect } = require('../middlewares/authMiddleware');
const { validateComment, validateCommentId } = require('../middlewares/validation/commentValidation');
const { createComment, getRecipeComments, deleteComment } = require('../controllers/commentController');

router.post('/', protect, validateComment, createComment);
router.get('/', getRecipeComments);
router.delete('/:id', protect, validateCommentId, deleteComment);

module.exports = router;
