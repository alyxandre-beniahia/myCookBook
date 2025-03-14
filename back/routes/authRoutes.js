const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Import validation middleware
const { 
    validateRegistration, 
    validateLogin 
} = require('../middlewares/validation/authValidation');

// Apply validation middleware to routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

module.exports = router;
