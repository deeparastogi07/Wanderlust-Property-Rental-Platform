const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main () {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("Hi, I'm root");
});

// INDEX Route
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
});

// NEW Route
app.get("/listings/new", async(req, res) => {
    res.render("./listings/new.ejs");
});

// CREATE Route
app.post("/listings" , async(req, res) => {
    const newListing = new Listing(req.body.listing);
    if (typeof req.body.listing.image === "string") {
        newListing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }
    await newListing.save();
    res.redirect("/listings");
});

// SHOW Route
app.get("/listings/:id", async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing});
});

// EDIT Route
app.get("/listings/:id/edit", async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", {listing});
});

// UPDATE Route
app.put("/listings/:id", async(req, res) => {
    let { id } = req.params;
    if (typeof req.body.listing.image === "string") {
        req.body.listing.image = {
            url: req.body.listing.image,
            filename: "listingimage"
        };
    }
    await Listing.findByIdAndUpdate(id, {...req.body.listing}); // deconstructing the body
    res.redirect(`/listings/${id}`);
});

// DESTROY Route
app.delete("/listings/:id", async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

app.listen(8080, () => {
    console.log('server is listening to port 8080');
});
