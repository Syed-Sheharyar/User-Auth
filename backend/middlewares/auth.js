const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwt = require("jsonwebtoken")

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next)=>{
    const { token } = req.cookies
    if (!token){
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
})

exports.authorizeRoles = (...roles)=>{
    return (req, res, next)=>{
          if (!roles.includes(req.user.role)){
        return next(new ErrorHandler(`Role ${req.user.role} has no access to this resource`, 403))
    }
    next()
    }
}