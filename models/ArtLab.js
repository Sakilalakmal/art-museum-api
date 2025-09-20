const mongoose = require("mongoose");
const { GENRES, MEDIUMS, CURRENCIES } = require("../constants/artEnums");
const ArtLabSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    year: { type: String }, // Allows "1889", "Unknown", "c. 1503", etc.
    genre: { type: String, enum: GENRES, required: true },
    medium: { type: String, enum: MEDIUMS, required: true },
    dimensions: { type: String }, // "77 cm × 53 cm" or "30 x 40 in"
    location: { type: String }, // "The Louvre, Paris", "Private Collection"
    imageUrl: { type: String, required: true }, // Cloudinary URL
    description: { type: String },
    tags: [{ type: String }], // ["portrait", "Dutch Golden Age"]
    provenance: { type: String }, // Ownership/exhibition history
    price: { type: Number }, // Estimated value (e.g., 5000000)
    priceCurrency: { type: String, default: "USD" },
    isOnDisplay: { type: Boolean, default: true },
    catalogNumber: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ArtLab", ArtLabSchema);
