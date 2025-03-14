const Recipe = require('../models/Recipe');
const cloudinary = require('../config/cloudinary');

const createRecipe = async (req, res) => {
  try {
    let imageData = {};
    
    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      const result = await cloudinary.uploader.upload(dataURI);
      imageData = {
        public_id: result.public_id,
        url: result.secure_url
      };
    }

    const recipe = await Recipe.create({
      ...req.body,
      image: imageData,
      author: req.user._id
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ message: '(createRecipe)Error creating recipe', error });
  }
};





// Get All Recipes
const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: '(getRecipes)Erreur lors de la récupération des recettes', error });
  }
};

// Get Single Recipe
const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'ratings',
        populate: { path: 'user', select: 'name' }
      });

    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: '(getRecipeById)Erreur lors de la récupération de la recette', error });
  }
};

// Add these to the existing controller file:

const updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }

    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à modifier cette recette' });
    }

    const updateData = {};
    const allowedFields = ['title', 'description', 'ingredients', 'steps', 'category', 'image'];
    
    Object.keys(req.body).forEach(field => {
      if (allowedFields.includes(field)) {
        updateData[field] = req.body[field];
      }
    });

    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: '(updateRecipe)Erreur lors de la modification de la recette', error });
  }
};

  
  const deleteRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ message: 'Recette non trouvée' });
      }
  
      // Delete image from Cloudinary if it exists
      if (recipe.image && recipe.image.public_id) {
        await cloudinary.uploader.destroy(recipe.image.public_id);
      }
  
      await Recipe.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Recette supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: '(deleteRecipe)Erreur lors de la suppression de la recette', error });
    }
  };
  
  
  const searchRecipes = async (req, res) => {
    const { query, category } = req.query;
    
    try {
      let searchQuery = {};
      
      if (query) {
        searchQuery = {
          $or: [
            { title: { $regex: query, $options: 'i' } },
            { ingredients: { $regex: query, $options: 'i' } }
          ]
        };
      }
      
      if (category) {
        searchQuery.category = category;
      }
  
      const recipes = await Recipe.find(searchQuery)
        .populate('author', 'name')
        .sort({ createdAt: -1 });
  
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: '(searchRecipes)Erreur lors de la recherche des recettes', error });
    }
  };
  
  const addRating = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      
      // Check if recipe exists
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      
      const { value } = req.body;
      
      // Validate value
      if (value === undefined || value < 1 || value > 5) {
        return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
      }
      
      // Check for existing rating by this user
      const existingRatingIndex = recipe.ratings.findIndex(
        rating => rating.user.toString() === req.user._id.toString()
      );
      
      if (existingRatingIndex !== -1) {
        // Update existing rating
        recipe.ratings[existingRatingIndex].value = value;
      } else {
        // Add new rating
        recipe.ratings.push({ 
          user: req.user._id, 
          value: value 
        });
      }
      
      const updatedRecipe = await recipe.save();
      res.status(200).json(updatedRecipe);
    } catch (error) {
      console.log('Rating error:', error); // Log the full error
      res.status(500).json({ message: 'Error adding rating', error: error.message });
    }
  };  
  
  
  const getRecipeRating = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      console.log('Recipe ratings:', recipe.ratings);
      if (recipe.ratings.length === 0) {
        return res.status(200).json({ average: 0, total: 0 });
      }
      
      const average = recipe.ratings.reduce((acc, curr) => acc + curr.value, 0) / recipe.ratings.length;
      res.status(200).json({ 
        average: Number(average.toFixed(1)), 
        total: recipe.ratings.length 
      });
    } catch (error) {
      res.status(500).json({ message: '(getRecipeRating)Erreur lors de la récupération de la note', error });
    }
  };
  
  


  
  module.exports = { 
    createRecipe, 
    getRecipes, 
    getRecipeById, 
    updateRecipe, 
    deleteRecipe,
    searchRecipes,
    addRating,
    getRecipeRating
  };
  


