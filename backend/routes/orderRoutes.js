const express = require("express")
const { newOrder } = require("../controllers/orderController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

const router = express.Router()

router.route("/order/new").post(isAuthenticatedUser, newOrder)


module.exports = router
