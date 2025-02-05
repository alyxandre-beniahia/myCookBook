const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validateRecipe } = require('../middlewares/validateMiddleware');
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe, searchRecipes } = require('../controllers/recipeController');

router.get('/search', searchRecipes);

router.post('/', protect, validateRecipe, createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipeById);
router.put('/:id', protect, validateRecipe, updateRecipe);
router.delete('/:id', protect, deleteRecipe);




module.exports = router;
