const Product = require("../models/Products");
const Cart = require("../models/Cart"); // Make sure you have this model

exports.renderUserPage = async (req, res) => {
    try {
        if (req.user.role === "USER") {
            const products = await Product.find();
            const username = req.user.userName;
            
            // Aggregate to find the count of cart items for the user
            const cart = await Cart.findOne({ userName: username });
            const cartCount = cart ? cart.products.length : 0;

            res.render("user", { title: "User", products, userName: username, cartCount });
        }
    } catch (err) {
        console.log(err);
    }
};
