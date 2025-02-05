const User = require('../models/User');

const updateUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Verify user can only update their own profile
      if (user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé à modifier cet utilisateur' });
      }
  
      const { name, email } = req.body;
  
      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email },
        { new: true }
      ).select('-password');
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
    }
  };

const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Ensure user can only delete their own account
      if (user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé à supprimer cet utilisateur' });
      }
  
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
    }
  };

// Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

// Get Single User
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
  }
};


  
  // Add to exports
  module.exports = { 
    getUsers, 
    getUserById, 
    deleteUser 
  };
  

module.exports = { getUsers, getUserById, deleteUser };
