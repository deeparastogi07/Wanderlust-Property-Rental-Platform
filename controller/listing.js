const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
}

module.exports.renderNewForm = async (req, res) => {
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req, res, next) => {
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
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing You requested does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render('./listings/show.ejs', { listing });
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing You requested does not exist!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", { listing });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    const imageUrl = req.body.listing.image;

    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "") {
        // Valid URL string provided
        req.body.listing.image = {
            url: imageUrl.trim(),
            filename: "listingimage"
        };
    } else if (!imageUrl || (typeof imageUrl === "string" && imageUrl.trim() === "")) {
        // Empty or missing — remove from update so existing image is kept
        delete req.body.listing.image;
    }

    await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstructing the body
    req.flash('success', 'Listing Updated');
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'Listing Deleted!');
    res.redirect("/listings");
}