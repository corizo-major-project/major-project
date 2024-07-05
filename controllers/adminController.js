const initialize = require('../repo/initialize'); // Adjust path as necessary
const Product = require("../models/Products");

exports.renderAdminPage = async (req, res) => {
    try {
        const username = req.user.userName;

        // Initialize products and reviews
        await initialize(username);

        // Retrieve products created by the user
        const products = await Product.find({ createdBy: username });

        res.render("admin", { title: "Admin", products });
    } catch (err) {
        console.error(err);
        res.render('error', { title: 'Error' });
    }
};

exports.renderProductPage = (req, res) => {
    res.render("admin/add-product", { title: "Add Product" });
};
