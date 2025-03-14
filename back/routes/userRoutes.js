const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { 
    getUsers, 
    getUserById, 
    deleteUser, 
    updateUser,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    updatePassword
} = require('../controllers/userController');

// Import validation middleware
const { 
    validatePasswordUpdate,     
    validateUserUpdate,
    validateUserId,
} = require('../middlewares/validation/userValidation');
const { validateRecipeId } = require('../middlewares/validation/recipeValidation');

// Apply validation middleware to routes
router.get('/favorites', protect, getFavorites);
router.patch('/favorites/:recipeId', protect,  validateRecipeId, addToFavorites);
router.delete('/favorites/:recipeId', protect, validateRecipeId, removeFromFavorites);

router.get('/', getUsers);
router.get('/:id', validateUserId, getUserById);
router.patch('/:id', protect, validateUserId, validateUserUpdate, updateUser);
router.patch('/:id/update-password', protect, validateUserId, validatePasswordUpdate, updatePassword);
router.delete('/:id', protect, validateUserId, deleteUser);

module.exports = router;
