const User = require("../models/user");


module.exports  = {
        // Get user by id
        // getUserById: async (req, res) => {
        //     try {
        //         const userId = req.params.userId;
        //         const user = await User.findById(userId);
        //         if (!user) {
        //             return res.status(404).json({ message: 'User not found' });
        //         }
        //         res.status(200).json(user);
        //     } catch (error) {
        //         console.error('Failed to get user by id', error);
        //         res.status(500).json({ message: 'Failed to get user by id' });
        //     }
        // },
    
        // Get all users
        getUsers: async (req, res) => {
            try {
                const users = await User.find();
                res.status(200).json(users);
            } catch (error) {
                console.error('Failed to get all users', error);
                res.status(500).json({ message: 'Failed to get all users' });
            }
        },

        // Delete user by id
        deleteUserById: async (req, res) => {
            try {
                const userId = req.params.userId;
                const user = await User.findByIdAndDelete(userId);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json({ message: 'User deleted successfully' });
            } catch (error) {
                console.error('Failed to delete user by id', error);
                res.status(500).json({ message: 'Failed to delete user by id' });
            }
        },

        // Update user by id
        updateUserById: async (req, res) => {
            const { userId } = req.params;
            const { updateData } = req.body;
            try {
                const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
                if (!updatedUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.status(200).json(updatedUser);
            } catch (error) {
                console.error('Failed to update user by id', error);
                res.status(500).json({ message: 'Failed to update user by id' });
            }
        },
};

