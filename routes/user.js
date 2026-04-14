const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controller/user.js");

router
    .route("/signup")
    // SignUp GET Route
    .get(userController.renderSignupForm)
    // SignUp POST Route
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    // Login GET Route
    .get(userController.renderLoginForm)
    // Login POST Route
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true
        }),
        wrapAsync(userController.login));

// Logout Route
router.get("/logout", wrapAsync(userController.logout));

module.exports = router;