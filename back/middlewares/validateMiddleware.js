const validateRecipe = (req, res, next) => {
    const { title, description, ingredients, steps, category } = req.body;
  
    if (!title || !description || !ingredients || !steps || !category) {
      return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' });
    }
  
    if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
      return res.status(400).json({ message: 'Les ingrédients et les étapes doivent être des tableaux' });
    }
  
    if (!['entrée', 'plat', 'dessert'].includes(category)) {
      return res.status(400).json({ message: 'Catégorie non valide' });
    }
  
    next();
  };
  
  const validateComment = (req, res, next) => {
    const { content } = req.body;
  
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Le commentaire ne peut pas être vide' });
    }
  
    next();
  };
  
  module.exports = { validateRecipe, validateComment };
  