const { body, param, validationResult } = require("express-validator");

// Helper function to check validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate recipe data
const validateRecipeData = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("ingredients").custom((value, { req }) => {
    try {
      // For multipart/form-data, ingredients will be a string that needs parsing
      const ingredients = JSON.parse(value);
      if (!Array.isArray(ingredients) || ingredients.length === 0) {
        throw new Error("At least one ingredient is required");
      }
      return true;
    } catch (error) {
      throw new Error("Invalid ingredients format or empty array");
    }
  }),

  body("steps").custom((value, { req }) => {
    try {
      // For multipart/form-data, steps will be a string that needs parsing
      const steps = JSON.parse(value);
      if (!Array.isArray(steps) || steps.length === 0) {
        throw new Error("At least one step is required");
      }
      return true;
    } catch (error) {
      throw new Error("Invalid steps format or empty array");
    }
  }),

  body("category").trim().notEmpty().withMessage("Category is required"),

  validateResults,
];

const validateRecipeUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Description must be between 10 and 1000 characters"),

  body("ingredients")
    .optional()
    .custom((value, { req }) => {
      try {
        // For multipart/form-data, ingredients will be a string that needs parsing
        if (typeof value === "string") {
          const ingredients = JSON.parse(value);
          if (!Array.isArray(ingredients) || ingredients.length === 0) {
            throw new Error("At least one ingredient is required");
          }
        } else if (Array.isArray(value) && value.length === 0) {
          throw new Error("At least one ingredient is required");
        }
        return true;
      } catch (error) {
        throw new Error("Invalid ingredients format or empty array");
      }
    }),

  body("steps")
    .optional()
    .custom((value, { req }) => {
      try {
        // For multipart/form-data, steps will be a string that needs parsing
        if (typeof value === "string") {
          const steps = JSON.parse(value);
          if (!Array.isArray(steps) || steps.length === 0) {
            throw new Error("At least one step is required");
          }
        } else if (Array.isArray(value) && value.length === 0) {
          throw new Error("At least one step is required");
        }
        return true;
      } catch (error) {
        throw new Error("Invalid steps format or empty array");
      }
    }),

  body("category")
    .optional()
    .trim()
    .isIn(["entrée", "plat", "dessert"])
    .withMessage("Category must be entrée, plat, or dessert"),

  validateResults,
];

// Validate recipe ID
const validateRecipeId = [
  param("id").isMongoId().withMessage("Invalid recipe ID format"),

  validateResults,
];

// Validate rating data
const validateRatingData = [
  body("value")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be a number between 1 and 5"),

  validateResults,
];

module.exports = {
  validateRecipeData,
  validateRecipeUpdate,
  validateRecipeId,
  validateRatingData,
};
