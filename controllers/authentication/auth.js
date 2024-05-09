const User= require('../../models/user')
const bcrypt= require('bcrypt')
const jwt=require('jsonwebtoken')

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
        const createdUser= await newUser.save();

        res.status(201).send({message:'User registered', user:createdUser});
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
        const token = generateToken(user); // Assuming you have a function to generate JWT tokens
        res.json({
            message: 'Logged in successfully',
            token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Error logging in user');
    }
};

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '24h', // expires in 24 hours
    });
};
module.exports ={loginUser, registerUser}