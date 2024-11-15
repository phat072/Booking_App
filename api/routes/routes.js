// routes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');

// User routes
router.post("/register", userController.register);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/logout", authenticate, userController.logout);
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

// Restaurant Routes
router.post("/restaurants", RestaurantController.createRestaurant);
router.patch("/restaurants/:restaurantId", RestaurantController.updateRestaurant); // Route for updating restaurant
router.delete("/restaurants/:restaurantId", RestaurantController.deleteRestaurant); // Route for deleting restaurant
router.get("/restaurants", RestaurantController.getAllRestaurants);
router.get("/restaurants/:restaurantId", RestaurantController.getRestaurantsById);
router.get("/restaurants/categories/:categoryId", RestaurantController.getRestaurantsByCategory);
router.get("/restaurants/search/:keyword", RestaurantController.searchRestaurants);
router.post("/restaurants/:restaurantId/suggestions", RestaurantController.addSuggestion); // New route for adding suggestions
router.post("/restaurants/:restaurantId/suggestions/:suggestionId/items", RestaurantController.addComboOrMeal);

// Feature Routes
router.get("/api/featured", FeatureController.getFeatured);
router.post("/api/featured", FeatureController.createFeatured);
router.put("/api/featured/:id", FeatureController.updateFeatured);

// Category Routes
router.post("/categories", CategoryController.createCategory);
router.get("/categories", CategoryController.getAllCategories);

// Map 
router.get("/nearby-restaurants", GeospatialController.getNearbyRestaurants);
router.get("/intersect-restaurants", GeospatialController.getIntersectbyRestaurants);
router.get('/restaurants-in-city', GeospatialController.getRestaurantsByPolygon);
router.get('/restaurants-in-circle', GeospatialController.getRestaurantsInCircle);

// Favorite 
router.post('/addToFavorites', UserController.addToFavorites);
router.post('/removeFromFavorites', UserController.removeFromFavorites);
router.get('/:userId/favoriteRestaurants', UserController.getFavoriteRestaurants);

// admin routes
router.get("/admin", AdminController.getAllUsers);
router.delete("/admin/:userId", AdminController.deleteUser);
router.put('/admin/:userId', AdminController.editUser); // Route cho editUser


// chat routes 
router.get('/api/chat', ChatController.getAllChats);
router.post('/api/chat', ChatController.postChatMessage)
router.get('/api/chat/:userId', ChatController.getUserChats)

module.exports = router;

