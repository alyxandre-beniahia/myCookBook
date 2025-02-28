const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validateRecipe } = require('../middlewares/validateMiddleware');
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, searchRecipes, addRating, getRecipeRating } = require('../controllers/recipeController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/search', searchRecipes);

// Combined single POST route
router.post('/', protect, upload.single('image'), validateRecipe, createRecipe);

router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, validateRecipe, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/ratings', protect, addRating);
router.get('/:id/ratings', getRecipeRating);


module.exports = router;
