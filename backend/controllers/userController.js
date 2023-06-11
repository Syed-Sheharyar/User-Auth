const User = require("../models/userModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const getToken = require("../utils/getjwtToken");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")

// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "sample id",
            url: "profile.png"
        }
    });

    getToken(user, 201, res)
})

// Login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body

    // Check if user has password or email both
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatched = user.comparePassword(password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    getToken(user, 200, res)
})

// Logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
    const options = {
        expires: new Date(Date.now()),
        httpOnly: true
    }
    res.status(200).cookie("token", null, options).json({ success: true, message: "Logout successfully" })
})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    // Get Reset Password Token
    const resetToken = user.getResetPasswordToken()
    await user.save({ validateBeforeSave: false })

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const message = `Your reset password token is :- \n\n ${resetPasswordURL} \n\n If you have not requested this email then, please ignore it`

    try {
        await sendEmail({
            email: user.email,
            subject: "Eccommerce Password Reset",
            message
        })
        res.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });
    }
    catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler("Something gone wrong", 404))
    }
})

// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")
    const user = User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is Invalid or has been expired", 400))
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    getToken(user, 200, res)
})

// Get Single User
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = user.comparePassword(req.body.oldPassword)
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old Password is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }

    user.password = req.body.newPassword
    await user.save()
    getToken(user, 200, res)
})

// Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    // Avatar shold be set on cloud DB
    await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true });
})

// Get All Users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({ success: true, users });
});

// Get Single User --- Admin
exports.getSingleUserForAdmin = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 400))
    }

    res.status(200).json({ success: true, user });
});

// Update User Role --- Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    await Product.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({ success: true });
})

// Delete User --- Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    let user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler("User not Found", 404))
    }

    await user.remove();

    res.status(200)
        .json({ success: true, message: "User Deleted successfully" });
});

// Create and Update Reviews
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, productId, comment } = req.body
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.comment = comment
                rev.rating = rating
            }
        })
    }
    else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }

    let avg = 0
    product.reviews.forEach((rev) => {
        avg += rev.rating
    })

    product.ratings = avg / product.reviews.length;
    await Product.save({ validateBeforeSave: false })
    res.status(200).json({ success: true });
})

// Get All Reviews
exports.GetAllReviews = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.id);
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    res.status(200).json({ success: true, reviews: product.reviews });
})

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.query.productId);
    if (!product) {
        return next(new ErrorHandler("Product not Found", 404))
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.id.toString())
    let avg = 0
    reviews.forEach((rev) => {
        avg += rev.rating
    })

    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId, { reviews, ratings, numOfReviews }, { new: true, runValidator: true, useFindAndModify: false })

    res.status(200).json({ success: true });
})