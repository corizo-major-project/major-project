// routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const homeController = require("../controllers/homeController");

router.get("/", homeController.landingPage);

router.get("/products",(req, res) =>{
    res.render("products", { title: "Products" });
});

router.get("/contact",(req, res) => {
    res.render("contact", { title: "Contact Us" });
});

router.get("/sign-up", authController.renderSignupForm );
//

router.post('/sign-up', authController.userRegister);

router.get("/login", authController.renderLoginForm);

router.post('/login', authController.userLogin);




// Admin Routes
router.get("/admin", adminController.renderAdminPage);


// User Routes
router.get("/user", userController.renderUserPage);

module.exports = router;
