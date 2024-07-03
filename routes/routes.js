// routes.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.get("/", (req,res) => {
    res.render('index', { title: "Home Page"});
});

router.get("/products",(req, res) =>{
    res.render("products", { title: "Products" });
});

router.get("/contact",(req, res) => {
    res.render("contact", { title: "Contact Us" });
});

router.get("/sign-up", (req, res) => {
    res.render("signup", { title: "Sign Up", user: req.user }); // Pass user object if authenticated
});
//

router.post('/sign-up', authController.userRegister);

router.get("/login", (req, res) => {
    res.render("login", { title: "Login", user: req.user });
    // Assuming req.user contains the authenticated user object if logged in
});

router.post('/login', authController.userLogin);

module.exports = router;
