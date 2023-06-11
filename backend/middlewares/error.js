const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // Wrong MongoDb _id Error
    if (err.name === "CastError") {
        const message = `Resource not Found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // MongoDb duplicate key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT Error
    if (err.name === "jsonWebTokenError") {
        const message = `JSON Web Token is Invalid, Try again`
        err = new ErrorHandler(message, 400)
    }

    // JWT Expire Error  
    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token is Expire, Try again`
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({ success: false, status: err.statusCode, message: err.message })
}