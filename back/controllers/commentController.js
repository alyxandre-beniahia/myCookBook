const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

const createComment = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recette non trouvée' });
    }
    const comment = await Comment.create({
      recipe: req.params.recipeId,
      user: req.user._id,
      content: req.body.content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name')
      .populate('recipe', 'title');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire', error });
  }
};

const getRecipeComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires', error });
  }
};

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé à supprimer ce commentaire' });
    }

    await comment.deleteOne();
    res.status(200).json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire', error });
  }
};

module.exports = { createComment, getRecipeComments, deleteComment };
