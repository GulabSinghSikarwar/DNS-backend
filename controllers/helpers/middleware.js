const jwt = require('jsonwebtoken');
const User = require('../../models/user');

async function verifyToken(token) {
    try {
        // Verify if token is being passed correctly
        console.log("Received token: ", token);

        // Verify token signature using the secret key
        console.log("Secret key:", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log("decode ........==========: ", decoded);

            if (err) {
                console.log("ERROR ", err);
                return
            }
            return decoded
        });
        console.log("Decoded token: ", decoded);
        console.log("........", decoded.exp);

        // Check token expiration
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (decoded.exp <= currentTimestamp) {
            return { valid: false, error: 'Token has expired' };
        }

        // Extract user ID from the token
        const userId = decoded._id;

        // Check if the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            return { valid: false, error: 'User does not exist' };
        }

        // Token is valid, return user ID
        return { valid: true, userId };
    } catch (error) {
        // Token verification failed
        console.error("Token verification failed: ", error);
        return { valid: false, error: 'Token verification failed' };
    }
}

async function validateHeaderToken(req, res, next) {
    try {
        // Extract token from headers
        // const token = req.headers.authorization.split(' ')[1];
        const token = req.body.token.trim().replace(/^"(.*)"$/, '$1'); // Trim and remove surrounding quotes
      
        // Verify token
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

module.exports = { verifyToken, validateHeaderToken }


