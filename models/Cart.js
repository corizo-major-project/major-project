const mongoose = require('mongoose');

// Define the Cart schema
const cartSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Array of product IDs
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
