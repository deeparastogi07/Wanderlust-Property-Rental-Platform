const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1771428999876-0a04cd3497a9?w=600"
        }
    },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", ListingSchema);
module.exports = Listing;