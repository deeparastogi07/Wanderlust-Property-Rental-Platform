const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");

// Validation For Schema (Middlewares)
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


// INDEX Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}));

// NEW Route
router.get("/new", isLoggedIn, wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}));

// CREATE Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    const imageUrl = req.body.listing.image;
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "") {
        newListing.image = {
            url: imageUrl.trim(),
            filename: "listingimage"
        };
    } else {
        newListing.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?w=1200",
            filename: "listingimage"
        };
    }

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
}));

// SHOW Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("reviews")
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing You requested does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing });
}));

// EDIT Route
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You requested does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}));

// UPDATE Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstructing the body
    req.flash('success', 'Listing Updated');
    res.redirect(`lisitngs/${id}`);
}));

// DESTROY Route
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'Listing Deleted!');
    res.redirect("/listings");
}));

module.exports = router;