const initializeAll = require('../repo/initializeAll'); // Adjust path as necessary
const Product = require("../models/Products");

exports.renderUserPage = async (req, res) => {
    try {
        const products = await Product.find();
        // console.log(products);
        res.render("user", { title: "User", products });
    }
    catch(err){
        console.log(err);
    }
}; 