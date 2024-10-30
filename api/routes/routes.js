// routes.js
const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.post("/register", userController.register);
router.get("/verify/:token", userController.verifyEmail);
router.post("/login", userController.login);
router.put("/address/:userId", userController.updateAddress);
router.get("/address/:userId", userController.getUserAddress);
router.put("/change-password/:userId", userController.changePassword);

module.exports = router;