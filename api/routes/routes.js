// routes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const RestaurantController = require('../controllers/restaurantController');
const FeatureController = require('../controllers/featureController');
const CategoryController = require('../controllers/categoryController');
const GeospatialController = require('../controllers/geospatialController');
const MessageController = require('../controllers/messageController');

// User routes
router.post("/register", userController.register);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);
// router.post("/logout", userController.logout);
router.put("/address/:userId", userController.updateAddress);
router.get("/address/:userId", userController.getUserAddress);
router.put("/change-password/:userId", userController.changePassword);
router.get("/user", userController.getCurrentUser);
router.get("/users/:userId", userController.getUserById);

// Admin routes
// router.get("/users/:userId", adminController.getUserById);
router.get("/admin", adminController.getUsers);
router.delete("/admin/:userId", adminController.deleteUserById);
router.put("/admin/:userId", adminController.updateUserById);


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
router.post("/restaurants/:restaurantId/suggestions", RestaurantController.addSuggestion); 
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

// // admin routes
// router.get("/admin", AdminController.getAllUsers);
// router.delete("/admin/:userId", AdminController.deleteUser);
// router.put('/admin/:userId', AdminController.editUser); // Route cho editUser



router.post('/request', MessageController.SendRequest);
router.get('/requests/:userId', MessageController.GetRequests);
router.post('/request/accept', MessageController.AcceptRequest);
router.post('/sendMessage', MessageController.SendMessage);
router.get('/messages', MessageController.GetMessages);


module.exports = router;

