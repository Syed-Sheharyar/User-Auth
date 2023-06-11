const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Address is required"]
        },   
         city: {
            type: String,
            required: [true, "City is required"]
        },
        state: {
            type: String,
            required: [true, "State is required"]
        },
        country: {
            type: String,
            required: [true, "Country is required"]
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "Name is required"]
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: [true, "Image is required"]
            },
            product: {
                type: mongoose.Schema.ObjectId,
                ref: "Product",
                required: true
            },
        },
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: true
        },
    },
    paidAt: {
        type: Date,
        required: [true, "Name is required"]
    },
    itemsPrice: {
        type: Number,
        default: 0
    },
    taxPrice: {
        type: Number,
        default: 0
    },
    shippingPrice: {
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        default: 0
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: Date

}, {timestamps: true})

module.exports = mongoose.model("Order", orderSchema)
