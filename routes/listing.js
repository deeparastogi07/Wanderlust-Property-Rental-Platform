const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");

// Validation For Schema (Middlewares)
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if(error) {
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
router.get("/new", wrapAsync(async (req, res) => {
    res.render("./listings/new.ejs");
}));

// CREATE Route
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    if (typeof req.body.listing.image === "string") {
        newListing.image = {
            url: req.body.listing.image,
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
    const listing = await Listing.findById(id).populate("reviews");
    res.render('./listings/show.ejs', { listing });
}));

// EDIT Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
}));

// UPDATE Route
router.put("/:id",validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstructing the body
    res.redirect(`lisitngs/${id}`);
}));

// DESTROY Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

module.exports = router;