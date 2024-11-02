// routes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');

// User routes
router.post("/register", userController.register);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);
router.put("/address/:userId", userController.updateAddress);
router.get("/address/:userId", userController.getUserAddress);
router.put("/change-password/:userId", userController.changePassword);

// Admin routes
router.get("/users/:userId", adminController.getUserById);
router.get("/users", adminController.getAllUsers);
router.delete("/users/:userId", adminController.deleteUserById);
router.put("/users/:userId", adminController.updateUserById);

// Favorite routes
router.post("/favorite/:userId", userController.addToFavoriteRestaurants);
router.post('/remove-favorite/:userId', userController.removeFromFavoriteRestaurants);
router.get('/:userId/favoriteRestaurants',userController.getFavoriteRestaurants);

// Order routes
router.post("/order", orderController.placeOrder);
router.get("/order/:userId", orderController.getOrderByUser);
router.get("/orders", orderController.getAllOrders);
router.put("/order/:orderId", orderController.updateOrderStatus);

module.exports = router;