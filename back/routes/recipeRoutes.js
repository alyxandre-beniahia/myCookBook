const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
  addRating,
  getRecipeRating,
} = require("../controllers/recipeController");

const {
  validateRecipeData,
  validateRecipeUpdate,
  validateRecipeId,
  validateRatingData,
} = require("../middlewares/validation/recipeValidation");
const upload = require("../middlewares/uploadMiddleware");

router.post(
  "/",
  protect,
  upload.single("image"),
  validateRecipeData,
  createRecipe
);
router.get("/", getRecipes);
router.get("/search", searchRecipes);
router.get("/:id", validateRecipeId, getRecipeById);
router.patch(
  "/:id",
  protect,
  upload.single("image"),
  validateRecipeId,
  validateRecipeUpdate,
  updateRecipe
);
router.delete("/:id", protect, validateRecipeId, deleteRecipe);
router.post(
  "/:id/ratings",
  protect,
  validateRecipeId,
  validateRatingData,
  addRating
);
router.get("/:id/ratings", validateRecipeId, getRecipeRating);

module.exports = router;
