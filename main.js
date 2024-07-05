require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const session = require("express-session");
const db = require("./config/db");
const Product = require("./models/Products");
const Review = require("./models/Reviews");
const multer = require('multer');

//app
const app = express();
const PORT = process.env.PORT || 5000;

// DB Connection
db.once('open', () => {
    console.log('Database connection is open.');
});

const fs = require('fs');
const path = require('path');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// async function initialize() {
//     const newProduct = new Product({
//         name: "Example Product",
//         description: "This is an example product",
//         price: 99.99,
//         createdBy: "User123"
//     });

//     // Save the product
//     await newProduct.save();

//     // Create reviews for the product
//     const review1 = new Review({
//         product: newProduct._id,
//         rating: 4,
//         comment: "Great product!"
//     });
//     await review1.save();

//     const review2 = new Review({
//         product: newProduct._id,
//         rating: 5,
//         comment: "Excellent!"
//     });
//     await review2.save();

//     const review3 = new Review({
//         product: newProduct._id,
//         rating: 1,
//         comment: "Too Bad!"
//     });
//     await review3.save();

//     // Calculate average rating for the product
//     await newProduct.calculateAverageRating();

//     // Retrieve the product with average rating and total reviews
//     const productWithRating = await Product.findById(newProduct._id);

//     // Output product details
//     console.log(productWithRating.name);
//     console.log("Average Rating:", productWithRating.average_review);
//     console.log("Total Reviews:", productWithRating.total_reviews_received);
// }

// initialize().catch(err => {
//     console.error('Error initializing:', err);
//     process.exit(1); // Exit with error 
// });


app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('views'));
app.use(express.static('logo'));

app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false
    })
);

app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("uploads"));
app.use('/uploads', express.static('uploads'));
// Set Template Engine
app.set("view engine", "ejs");

// Routes
app.use("/", require("./routes/routes"));



app.listen(PORT, () => {
    console.log(`Server Started at Port: ${PORT}`);
});
