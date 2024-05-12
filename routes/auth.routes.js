const express = require('express');
const router = express.Router(); 
const { loginUser, registerUser, validateToken } = require('../controllers/authentication/auth');
 
// Register User
router.post('/login',loginUser );

// Login User
router.post('/register', registerUser);

router.post('/validateToken',validateToken)

module.exports =router