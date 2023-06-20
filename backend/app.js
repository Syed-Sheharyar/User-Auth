const express = require("express")
const errorMiddleware = require("./middlewares/error")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieparser())
app.use(cors({ origin: "*" }))

// Serving static files
app.use(express.static(__dirname + "/public"))

// Route imports
const productRoute = require("./routes/productRoutes")
const userRoute = require("./routes/userRoutes")
const orderRoute = require("./routes/orderRoutes")

app.use("/api/v1", productRoute)
app.use("/api/v1", userRoute)
app.use("/api/v1", orderRoute)

// 404 error middleware
app.use((req, res, next) => {
    let err = new Error("Page not found")
    err.statusCode = 404
    next(err)
})

// Middleware for Errors
app.use(errorMiddleware)

module.exports = app