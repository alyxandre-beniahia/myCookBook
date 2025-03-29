const { body, param, validationResult } = require('express-validator');

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
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  
  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
  
  body('ingredients.*')
    .trim()
    .notEmpty().withMessage('Ingredient cannot be empty'),
  
  body('steps')
    .isArray({ min: 1 }).withMessage('At least one step is required'),
  
  body('steps.*')
    .trim()
    .notEmpty().withMessage('Step cannot be empty'),
  
  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),
  
  validateResults
];

// Add this to your recipeValidation.js file
const validateRecipeUpdate = [
    body('title')
      .optional()
      .trim()
      .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
    
    body('ingredients')
      .optional()
      .isArray({ min: 1 }).withMessage('At least one ingredient is required'),
    
    body('ingredients.*')
      .optional()
      .trim()
      .notEmpty().withMessage('Ingredient cannot be empty'),
    
    body('steps')
      .optional()
      .isArray({ min: 1 }).withMessage('At least one step is required'),
    
    body('steps.*')
      .optional()
      .trim()
      .notEmpty().withMessage('Step cannot be empty'),
    
    body('category')
      .optional()
      .trim()
      .isIn(['entrée', 'plat', 'dessert']).withMessage('Category must be entrée, plat, or dessert'),
    
    validateResults
  ];
  

// Validate recipe ID
const validateRecipeId = [
  param('id')
    .isMongoId().withMessage('Invalid recipe ID format'),
  
  validateResults
];

// Validate rating data
const validateRatingData = [
  body('value')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
  
  validateResults
];

module.exports = {
  validateRecipeData,
  validateRecipeUpdate,
  validateRecipeId,
  validateRatingData,
};
