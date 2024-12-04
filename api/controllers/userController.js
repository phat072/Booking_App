require('dotenv').config({ path: './configs/.env' });

const User = require('../models/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const tokenBlacklist = new Set();

const sendVerificationEmail = async (email, verificationToken) => {
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    // Send mail with defined transport object
    const mailOptions = {
        from: "BookingRestaurant.com",
        to: email,
        subject: 'Please verify your email',
        text: `Click on the link to verify your email: http://localhost:8000/verify/${verificationToken}`
    };
    // Send mail
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent');
    } catch (error) {
        console.error('Failed to send email', error);
    }
}

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
}

const secretKey = generateSecretKey();

module.exports = {
    // Register a new user
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const user = new User({ name, email, password });
            const verificationToken = jwt.sign({ email }, secretKey, { expiresIn: '1d' });
            user.verificationToken = verificationToken;
            await user.save();
            await sendVerificationEmail(email, verificationToken);
            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Failed to register user', error);
            res.status(500).json({ message: 'Failed to register user' });
        }
    },

    // Verify email
    verifyEmail: async (req, res) => {
        try {
            const token = req.params.token;
            const user = await User.findOne({ verificationToken: token });
            if (!user) {
                return res.status(404).json({ message: 'Invalid verification token' });
            }
            user.verified = true;
            user.verificationToken = undefined;
            await user.save();
            res.status(200).json({ message: 'Email verified successfully' });
        } catch (error) {
            console.error('Failed to verify email', error);
            res.status(500).json({ message: 'Failed to verify email' });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
          const { email, password } = req.body;
    
          //check if the user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
          }
    
          //check if the password is correct
          if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
          }
    
          const token = jwt.sign(
            { userId: user._id, admin: user.admin },
            secretKey
          );
    
        //   res.status(200).json({ token });
        res.send({ user, token   });
          // Generate a token with role information
          // const token = jwt.sign({ userId: user._id, admin: user.admin }, secretKey);
    
          // res.status(200).json({ token, admin });
        } catch (error) {
          res.status(500).json({ message: "Login Failed" });
        }
      },

    // Logout user
    logout: async (req, res) => {
        try {
            const authHeader = req.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Authorization token required' });
            }

            const token = authHeader.replace('Bearer ', '');
            tokenBlacklist.add(token); 
            res.status(200).json({ message: 'User logged out successfully' });
        } catch (error) {
            console.error('Failed to logout user', error);
            res.status(500).json({ message: 'Failed to logout user' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Failed to get user by id', error);
            res.status(500).json({ message: 'Failed to get user by id' });
        }
    },

    // Get user
    // getUser: catchAsync(async (req, res) => {
    //     const { userId } = req.params;
    //     console.log(userId);
    //     const user = await userService.getUserById(userId);
    //     if (!user) {
    //         throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    //     }
    //     res.send(user);
    // }),
    
    // Get current user
    getCurrentUser: async (req, res) => {
        try {
            // Get token from Authorization header
            const token = req.headers.authorization?.split(" ")[1];
    
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
    
            // Secret key should be the same as the one used to sign the token
            const secret = process.env.JWT_SECRET || 'your_jwt_secret';  // Replace with actual secret
    
            // Verify token and decode it
            const decoded = jwt.verify(token, secret);
            const userId = decoded.userId;
    
            // Fetch user from database
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            res.status(200).json(user);
        } catch (error) {
            console.error('Failed to get current user', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ message: 'Invalid token' });
            }
            res.status(500).json({ message: 'Failed to get current user' });
        }
    },
    // Update Address
    updateAddress: async (req, res) => {
        try {
            const userId = req.params.userId;
            const updateFields = req.body;
            const locationUpdate = updateFields.latitude && updateFields.longitude ? {
                location: {
                    type: 'Point',
                    coordinates: [updateFields.longitude, updateFields.latitude],
                },
            } : {};

            const user = await User.findByIdAndUpdate(
                userId,
                { $set: { ...updateFields, ...locationUpdate } },
                { new: true }
            );

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Failed to update address', error);
            res.status(500).json({ message: 'Failed to update address' });
        }
    },

    // Get User Address
    getUserAddress: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Failed to get user address', error);
            res.status(500).json({ message: 'Failed to get user address' });
        }
    },

    // Add to favorite restaurants
    addToFavoriteRestaurants: async (req, res) => {
        try {
            const { userId } = req.params;  // Get userId from the URL parameters
            const { restaurantId } = req.body;  // Get restaurantId from the request body
    
            // Find the user by userId
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            // Check if the restaurant is already in the favorite list
            if (user.favoriteRestaurants.includes(restaurantId)) {
                return res.status(400).json({ message: 'Restaurant already in favorite list' });
            }
    
            // Add the restaurantId to the favoriteRestaurants array
            user.favoriteRestaurants.push(restaurantId);
            await user.save();  // Save the updated user
    
            // Respond with a success message
            res.status(200).json({ message: "Added to favorites successfully" });
        } catch (error) {
            console.error('Failed to add to favorite restaurants', error);
            res.status(500).json({ message: 'Failed to add to favorite restaurants' });
        }
    },

    // Remove from favorite restaurants
    removeFromFavoriteRestaurants: async (req, res) => {
        try {
            const { userId } = req.params;  
            const { restaurantId } = req.body;  
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the restaurant is in the favorite list
            if (!user.favoriteRestaurants.includes(restaurantId)) {
                return res.status(400).json({ message: 'Restaurant not in favorite list' });
            }
            user.favoriteRestaurants = user.favoriteRestaurants.filter(id => id.toString() !== restaurantId);
            await user.save();
            res.status(200).json({ message: "Removed from favorites successfully" });
        } catch (error) {
            console.error('Failed to remove from favorite restaurants', error);
            res.status(500).json({ message: 'Failed to remove from favorite restaurants' });
        }
    },

    // Get favorite restaurants
    getFavoriteRestaurants: async (req, res) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId).populate('favoriteRestaurants');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user.favoriteRestaurants);
        } catch (error) {
            console.error('Failed to get favorite restaurants', error);
            res.status(500).json({ message: 'Failed to get favorite restaurants' });
        }
    },

    // Change Password
    changePassword: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.password !== oldPassword) {
                return res.status(401).json({ message: 'Incorrect old password' });
            }
            if (newPassword !== confirmPassword) {
                return res.status(400).json({ message: 'Passwords do not match' });
            }
            user.password = newPassword;
            await user.save();
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error('Failed to change password', error);
            res.status(500).json({ message: 'Failed to change password' });
        }
    },

}
