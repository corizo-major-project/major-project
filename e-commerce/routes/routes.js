const express = require('express');
const router = express.Router();

//Controllers Import Section
const homeController = require("../controllers/homeController");
const authController = require("../controllers/authController");

// Home Sections Endpoints
router.get("/", homeController.landingPage);

// AuthController Endpoints
router.get("/sign-up", authController.renderSignupForm);
router.post('/sign-up', authController.userRegister);
router.get("/login", authController.renderLoginForm);
router.post('/login', authController.userLogin);
router.get('/logout', authController.logouthandle);

module.exports = router;