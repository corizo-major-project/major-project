// routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');
const userController = require("../controllers/userController");
const adminController = require("../controllers/adminController");
const homeController = require("../controllers/homeController");
const commonController = require("../controllers/commonController");
const verifyToken = require('../middleware/authMiddleware');
const Product = require("../models/Products");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

var upload = multer({
    storage: storage,
}).single('image');

router.get("/", homeController.landingPage);

router.get("/products", (req, res) => {
    res.render("products", { title: "Products" });
});

router.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact Us" });
});

router.get("/sign-up", authController.renderSignupForm);
//

router.post('/sign-up', authController.userRegister);

router.get("/login", authController.renderLoginForm);

router.post('/login', authController.userLogin);




// Admin Routes
router.get("/admin", verifyToken, adminController.renderAdminPage);
router.get("/admin/add-product", verifyToken, adminController.renderProductPage);
router.post("/admin/add-product", verifyToken, upload, async (req, res) => {
    try {
        if (req.user.role === "ADMIN") {
            const product = new Product({
                name: req.body.name,
                price: req.body.price,
                image: req.file.filename,
                description: req.body.description,
                createdBy: req.user.userName
            });
            console.log(req.user.userName);
            console.log(req.user.role);
            await product.save();
            res.redirect("/admin");
        }
        res.redirect("/user")
    }
    catch (error) {
        console.log(error);
    }
});


// User Routes
router.get("/user", verifyToken, userController.renderUserPage);


// Common Routes
router.get("/product/:id", verifyToken, commonController.productInfo);
router.get("/cart/add/:id", verifyToken, commonController.addProductToCart);
router.post('/cart/remove/:id', verifyToken, commonController.removeProductFromCart);
router.get("/cart", verifyToken, commonController.getCartItems);

//logout
router.get('/logout', authController.logouthandle);

module.exports = router;
