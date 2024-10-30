require('dotenv').config({ path: './configs/.env' });

const User = require('../model/user');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.verified) {
                return res.status(400).json({ message: 'Email not verified' });
            }
            if (user.password !== password) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = jwt.sign({ userId: user._id, admin: user.admin }, secretKey);
            res.status(200).json({ token });
        } catch (error) {
            console.error('Failed to login user', error);
            res.status(500).json({ message: 'Failed to login user' });
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

    // Get user by id
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

    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            console.error('Failed to get all users', error);
            res.status(500).json({ message: 'Failed to get all users' });
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
            const { userId, restaurantId } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if the restaurant is already in the favorite list
            if (user.favoriteRestaurants.includes(restaurantId)) {
                return res.status(400).json({ message: 'Restaurant already in favorite list' });
            }
            user.favoriteRestaurants.push(restaurantId);
            await user.save();
            res.status(200).json({ message: "Added to favorites successfully" });
        } catch (error) {
            console.error('Failed to add to favorite restaurants', error);
            res.status(500).json({ message: 'Failed to add to favorite restaurants' });
        }
    },

    // Remove from favorite restaurants
    removeFromFavoriteRestaurants: async (req, res) => {
        try {
            const { userId, restaurantId } = req.body;
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
