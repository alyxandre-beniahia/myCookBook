const validateRecipe = (req, res, next) => {
  const { title, description, category } = req.body;
  let ingredients, steps;

  try {
    ingredients = JSON.parse(req.body.ingredients);
    steps = JSON.parse(req.body.steps);
    console.log('Parsed ingredients:', ingredients);
    console.log('Parsed steps:', steps);
  } catch (error) {
    return res.status(400).json({ message: 'Format des ingrédients ou étapes invalide' });
  }

  if (!title || !description || !ingredients || !steps || !category) {
    return res.status(400).json({ message: 'Tous les champs requis doivent être remplis' });
  }

  if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
    console.log('ingredients:', ingredients);
    console.log('steps:', steps);
    return res.status(400).json({ message: 'Les ingrédients et les étapes doivent être des tableaux' });
  }

  
  if (!['entrée', 'plat', 'dessert'].includes(category)) {
    console.log("category", category);
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
  