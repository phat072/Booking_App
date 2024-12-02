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
const ChatController = require('../controllers/chatController');


const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const messageValidation = require('../validations/messageValidation');
const messageController = require('../controllers/messageController');


// User routes
router.post("/register", userController.register);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);
// router.post("/logout", userController.logout);
router.put("/address/:userId", userController.updateAddress);
router.get("/address/:userId", userController.getUserAddress);
router.put("/change-password/:userId", userController.changePassword);
router.get("/user", userController.getCurrentUser);

// Admin routes
router.get("/users/:userId", adminController.getUserById);
router.get("/users", adminController.getUsers);
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

// // admin routes
// router.get("/admin", AdminController.getAllUsers);
// router.delete("/admin/:userId", AdminController.deleteUser);
// router.put('/admin/:userId', AdminController.editUser); // Route cho editUser


// chat routes 
router.get('/api/chat', ChatController.getAllChats);
router.post('/api/chat', ChatController.postChatMessage)
router.get('/api/chat/:userId', ChatController.getUserChats)

// Message routes (Explicit integration)
router
  .route('/messages')
  .post(authenticate('sendMessages'), validate(messageValidation.createMessage), messageController.createMessage)
  .get(authenticate('getMessages'), validate(messageValidation.getMessagesByUserId), messageController.getMessagesByUserId);

router
  .route('/messages/:messageId')
  .get(authenticate('getMessages'), validate(messageValidation.getMessage), messageController.getMessage)
  .patch(authenticate('manageMessages'), validate(messageValidation.updateMessage), messageController.updateMessage)
  .delete(authenticate('manageMessages'), validate(messageValidation.deleteMessage), messageController.deleteMessage);


// message routes
module.exports = router;


