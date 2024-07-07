const Product = require("../models/Products");
const Review = require("../models/Reviews");
const Cart = require('../models/Cart'); 

exports.productInfo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const reviews = await Review.find({ product: req.params.id });
        if (!product) {
            return res.status(404).render('error', { error: 'Product not found' });
        }

        const cart = await Cart.findOne({ userName: req.user.userName});
        const cartCount = cart ? cart.products.length : 0;
        res.render("product-info", { product, reviews, title: "Product Info", userName: req.user.userName, cartCount });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { error: 'Internal Server Error' });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const userName = req.user.userName;
        const productId = req.params.id;
        await Cart.updateOne(
            { userName: userName },
            { $addToSet: { products: productId } },
            { upsert: true }
        );
        const cart = await Cart.findOne({ userName: userName }).lean();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productDetails = await Product.find({ _id: { $in: cart.products } });
        const cart2 = await Cart.findOne({ userName: userName });
        const cartCount = cart2 ? cart2.products.length : 0;
        res.redirect("/user");
    } catch (err) {
        console.error(err);
    }
};

exports.getCartItems = async (req,res) => {
    try {
        const userName = req.user.userName
        const cart = await Cart.findOne({ userName: userName }).lean();
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const productDetails = await Product.find({ _id: { $in: cart.products } });
        const cart2 = await Cart.findOne({ userName: userName });
        const cartCount = cart2 ? cart2.products.length : 0;
        res.render("add-to-cart", { title: "Cart", productDetails: productDetails, userName: req.user.userName, cartCount });
    }
    catch(err){
        console.error(err);
    }
}

exports.removeProductFromCart = async (req, res) => {
    try {
        const userName = req.user.userName;
        const productId = req.params.id;

        await Cart.updateOne(
            { userName: userName },
            { $pull: { products: productId } }
        );

        res.redirect("/cart"); // Redirect to cart page after removing item
    } catch (err) {
        console.error(err);
    }
};