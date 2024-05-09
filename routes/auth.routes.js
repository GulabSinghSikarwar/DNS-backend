const express = require('express');
const router = express.Router(); 
const { loginUser, registerUser } = require('../controllers/authentication/auth');
 
// Register User
router.post('/login',loginUser );

// Login User
router.post('/register', registerUser);

module.exports =router