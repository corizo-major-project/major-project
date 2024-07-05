const initialize = require('../repo/initialize'); // Adjust path as necessary
const Product = require("../models/Products");

exports.renderAdminPage = async (req, res) => {
    try {
        if (req.user.role === "ADMIN") {
            const username = req.user.userName;

            // Initialize products and reviews
            await initialize(username);

            // Retrieve products created by the user
            const products = await Product.find({ createdBy: username });
            console.log(products.length)
            res.render("admin", { title: "Admin", products });
        }
        res.redirect("/user")

    } catch (err) {
        console.error(err);
        res.render('error', { title: 'Error' });
    }
};

exports.renderProductPage = (req, res) => {
    res.render("admin/add-product", { title: "Add Product" });
};
