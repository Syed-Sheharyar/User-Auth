const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        maxlength: [8, "Price cannot exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id:{
                type: String,
                required: true
           },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Category is required"]
    },
    stock: {
        type: Number,
        required: [true, "Stock is required"],
        maxlength: [4, "Price cannot exceed 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name:{
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],

}, {timestamps: true})

module.exports = mongoose.model("Product", productSchema)
