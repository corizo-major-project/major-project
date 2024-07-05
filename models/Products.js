// products.js
const mongoose = require('mongoose');
const Review = require('./Reviews'); // Assuming Review model is defined in Review.js

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    createdBy: { type: String, required: true },
    average_review: { type: Number, default: 0 },
    total_reviews_received: { type: Number, default: 0 },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    image: { type: String, required: true }
});

// Define instance method to calculate average rating
productSchema.methods.calculateAverageRating = async function() {
    const productId = this._id;

    const result = await Review.aggregate([
        { $match: { product: productId } },
        {
            $group: {
                _id: "$product",
                averageRating: { $avg: "$rating" },
                count: { $sum: 1 }
            }
        }
    ]);

    if (result.length > 0) {
        const { averageRating, count } = result[0];
        this.average_review = averageRating;
        this.total_reviews_received = count;
    } else {
        this.average_review = 0;
        this.total_reviews_received = 0;
    }
    await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
