const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");

// Create Product --- Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
})

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search().filter().pagination(resultPerPage)
    const products = await apiFeature.query
    res.status(200).json({ success: true, products, productCount });
});

// Get Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

     if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    res.status(200).json({ success: true, product });
});

// Update Product --- Admin
exports.updateProduct = catchAsyncErrors( async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return next(new ErrorHandler("Product not Found", 404))
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, product });
});

// Delete Product --- Admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    await product.remove();

    res.status(200)
      .json({ success: true, message: "Product Deleted successfully" });
});
