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
    getFavorites 
} = require('../controllers/userController');

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:recipeId', protect, addToFavorites);
router.delete('/favorites/:recipeId', protect, removeFromFavorites);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);



module.exports = router;
