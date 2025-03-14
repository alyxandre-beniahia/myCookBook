const { body, param, validationResult } = require('express-validator');

// Helper function to check validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate user creation/update data
const validateUserData = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  validateResults
];

// Validate password update
const validatePasswordUpdate = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter'),
  
  validateResults
];

const validateUserUpdate = [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Must be a valid email address')
      .normalizeEmail(),
    
    validateResults
  ];

// Validate user ID
const validateUserId = [
  param('id')
    .isMongoId().withMessage('Invalid user ID format'),
  
  validateResults
];

module.exports = {
  validateUserData,
  validateUserUpdate,
  validatePasswordUpdate,
  validateUserId,
};
