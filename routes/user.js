const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

// SignUp GET Route
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// SignUp POST Route
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "Welcome to wanderlust!");
        res.redirect("/listings");
    } catch (e) {
        req.flash("errror", e.message);
        res.redirect("/signup");
    }
}));

// Login GET Route
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// Login POST Route
router.post(
    "/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    wrapAsync(async (req, res) => {
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
    }
    ));

// Logout Route
router.get("/logout", wrapAsync(async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are successfully logged out");
        res.redirect("/listings");
    });
}));

module.exports = router;