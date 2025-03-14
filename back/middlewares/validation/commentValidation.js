const { body, param, validationResult } = require('express-validator');

// Helper function to check validation results
const validateResults = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validate comment creation/update
const validateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  
  validateResults
];

// Validate comment ID
const validateCommentId = [
  param('id')
    .isMongoId().withMessage('Invalid comment ID format'),
  
  validateResults
];

module.exports = {
  validateComment,
  validateCommentId
};
