// initialize.js
const Product = require("../models/Products");
const Review = require("../models/Reviews");

async function initialize(username) {
    try {
        // Retrieve all products created by the username
        const products = await Product.find({ createdBy: username });

        // Iterate through each product
        for (let product of products) {
            // Fetch reviews for the product
            const reviews = await Review.find({ product: product._id });

            // Calculate average rating for the product
            let totalRating = 0;
            reviews.forEach(review => {
                totalRating += review.rating;
            });

            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

            // Map the average rating to the product
            product.average_review = averageRating;
            product.total_reviews_received = reviews.length;

            // Save the updated product with average rating
            await product.save();

            // Output reviews for the product
            reviews.forEach(review => {
                console.log("Review:", review.rating, review.comment);
            });
        }
    } catch (err) {
        console.error('Error initializing:', err);
        process.exit(1); // Exit with error 
    }
}

module.exports = initialize;
