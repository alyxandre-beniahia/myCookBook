const User = require('../models/User');

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

const addToFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.recipeId;
        if (!user.favorites.includes(recipeId)) {
            user.favorites.push(recipeId);
            await user.save();
        }
        res.status(200).json({ message: 'Recipe added to favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding to favorites', error });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const recipeId = req.params.recipeId;
        user.favorites = user.favorites.filter(id => id.toString() !== recipeId);
        await user.save();
        res.status(200).json({ message: 'Recipe removed from favorites' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from favorites', error });
    }
};

const getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.status(200).json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching favorites', error });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addToFavorites,
    removeFromFavorites,
    getFavorites
};
