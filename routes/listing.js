const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controller/listing.js");

router
    .route("/")
    // INDEX Route
    .get(wrapAsync(listingController.index))
    // CREATE Route
    .post(isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// NEW Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));

router
    .route("/:id")
    // SHOW Route
    .get(wrapAsync(listingController.showListing))
    //UPDATE Route
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    // DESTROY Route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// EDIT Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;