const express = require("express")
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getSingleUser, updatePassword, updateProfile, getAllUsers, getSingleUserForAdmin, updateUserRole, deleteUser, createProductReview, GetAllReviews, deleteReview } = require("../controllers/userController")
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth")

const router = express.Router()

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

router.route("/password/forgot").post(forgotPassword)

router.route("/password/reset/:token").put(resetPassword)

router.route("/logout").get(logoutUser)

router.route("/me").get(isAuthenticatedUser, getSingleUser)

router.route("/password/update").put(isAuthenticatedUser, updatePassword)

router.route("/me/update").put(isAuthenticatedUser, updateProfile)

router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUsers)

router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUserForAdmin).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser)

router.route("/review").put(isAuthenticatedUser, createProductReview)

router.route("/reviews").get(GetAllReviews).delete(isAuthenticatedUser, deleteReview)

module.exports = router