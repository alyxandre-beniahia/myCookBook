const Recipe = require('../models/Recipe');

// Create Recipe
const createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, category, image } = req.body;
  
  try {
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      category,
      image: image || 'placeholder.jpg',
      author: req.user._id
    });

    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la recette', error });
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
    res.status(500).json({ message: 'Erreur lors de la récupération des recettes', error });
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
    res.status(500).json({ message: 'Erreur lors de la récupération de la recette', error });
  }
};

// Add these to the existing controller file:

const updateRecipe = async (req, res) => {
    const { title, description, ingredients, steps, category, image } = req.body;
  
    try {
      let recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recette non trouvée' });
      }
  
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé à modifier cette recette' });
      }
  
      recipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        { title, description, ingredients, steps, category, image },
        { new: true }
      );
  
      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la modification de la recette', error });
    }
  };
  
  const deleteRecipe = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
  
      if (!recipe) {
        return res.status(404).json({ message: 'Recette non trouvée' });
      }
  
      if (recipe.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Non autorisé à supprimer cette recette' });
      }
  
      await Recipe.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Recette supprimée avec succès' });
    } catch (error) {
      res.status(500).json({ message: 'Erreur lors de la suppression de la recette', error });
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
      res.status(500).json({ message: 'Erreur lors de la recherche des recettes', error });
    }
  };


  
  module.exports = { 
    createRecipe, 
    getRecipes, 
    getRecipeById, 
    updateRecipe, 
    deleteRecipe,
    searchRecipes,
  };
  


