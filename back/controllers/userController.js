const User = require('../models/User');
const bcrypt = require('bcrypt');

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

        // Create an update object with only allowed fields
        const updateData = {};
        const allowedFields = ['name', 'email', 'favorites']; // Add any other fields that should be updatable
        
        Object.keys(req.body).forEach(field => {
            if (allowedFields.includes(field)) {
                updateData[field] = req.body[field];
            }
        });

        // Use $set operator for partial updates
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
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
// Add to favorites// Add to favorites
const addToFavorites = async (req, res) => {
    try {
      const userId = req.user.id;
      const recipeId = req.params.id;
      
      // Update the user by adding the recipe to their favorites array
      const user = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { favorites: recipeId } }, // $addToSet prevents duplicates
        { new: true }
      );
      
      res.json(user.favorites);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  // Get favorites
  const getFavorites = async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Find the user and populate their favorites
      const user = await User.findById(userId).populate('favorites');
      
      res.json(user.favorites || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

const removeFromFavorites = async (req, res) => {
    try {
      const userId = req.user.id;
      const recipeId = req.params.id;
      
      // Update the user by removing the recipe from their favorites array
      const user = await User.findByIdAndUpdate(
        userId,
        { $pull: { favorites: recipeId } }, // $pull removes the recipeId from the favorites array
        { new: true }
      );
      
      res.json(user.favorites || []);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
const updatePassword = async (req, res) => {
    try {
        // Log what we're receiving to help debug
        console.log('Update password request for user:', req.user._id);
        
        const user = await User.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const { currentPassword, newPassword } = req.body;
        
        // Check if both passwords are provided
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Both current password and new password are required' 
            });
        }
        
        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        
        // Validate new password format (in case validation middleware didn't catch it)
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'New password must be at least 6 characters long' 
            });
        }
        
        if (!/\d/.test(newPassword)) {
            return res.status(400).json({ 
                message: 'New password must contain at least one number' 
            });
        }
        
        if (!/[A-Z]/.test(newPassword)) {
            return res.status(400).json({ 
                message: 'New password must contain at least one uppercase letter' 
            });
        }
        
        // Update the password
        user.password = newPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Password update error:', error);
        res.status(500).json({ 
            message: 'Error updating password', 
            error: error.message || 'Unknown error' 
        });
    }
};



module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    updatePassword,
};
