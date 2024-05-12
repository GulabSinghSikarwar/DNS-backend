const User = require('../../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { verifyToken } = require('../helpers/middleware')
const registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword
        });

        // Save the user to the database
        const createdUser = await newUser.save();
        const token = generateToken(createdUser);

        res.status(201).send({ message: 'User registered', user: createdUser, token });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Generate JWT or any other authentication mechanism you are using
        const token = generateToken(user);
        const result = await verifyToken(token);

        // Assuming you have a function to generate JWT tokens
        res.json({
            message: 'Logged in successfully',
            token,
            result
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
};

const generateToken = (user) => {
    return jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '4h', // expires in 4 hours
    });
};


const validateToken = async (req, res) => {
    try {
        // Extract token from request body
        const body = req.body;  // Replace with your actual secret key
        const token = req.body.token.trim().replace(/^"(.*)"$/, '$1')
        console.log('token -------------: ', token);
        // Verify token
        console.log("token : ", token);
        const result = await verifyToken(token);

        if (result.valid) {
            res.status(200).json({ message: 'Token is valid', userId: result.userId });
        } else {
            res.status(401).json({ error: result.error });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
module.exports = { loginUser, registerUser, validateToken }