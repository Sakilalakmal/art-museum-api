const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage, upload } = require("../service/cloudinary");
const ArtLab = require("../models/ArtLab");
const { GENRES, CURRENCIES, MEDIUMS } = require("../constants/artEnums");

//render form
router.get("/", (req, res) => {
  res.render("upload", {
    genres: GENRES,
    currencies: CURRENCIES,
    mediums: MEDIUMS,
    message: "",
  });
});



// POST /api/artworks
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      artist,
      year,
      genre,
      medium,
      dimensions,
      location,
      description,
      tags,
      provenance,
      price,
      priceCurrency,
      isOnDisplay,
      catalogNumber,
    } = req.body;

    // === 1. Duplicate Check: title + artist + year ===
    const existing = await ArtLab.findOne({
      title: title?.trim(),
      artist: artist?.trim(),
      year: year?.trim(),
    });
    if (existing) {
      return res.render("upload", {
        genres: GENRES,
        currencies: CURRENCIES,
        mediums: MEDIUMS,
        message: "This painting already exists in the database.",
      });
    }

    // === 2. After Upload: Check for same imageUrl ===
    const urlExists = await ArtLab.findOne({ imageUrl: req.file.path });
    if (urlExists) {
      return res.render("upload", {
        genres: GENRES,
        currencies: CURRENCIES,
        mediums: MEDIUMS,
        message: "This image has already been uploaded.",
      });
    }

    // === 3. Prepare tags as array ===
    const tagsArray =
      typeof tags === "string"
        ? tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : Array.isArray(tags)
        ? tags
        : [];

    // === 4. Create new document ===
    const newArt = new ArtLab({
      title,
      artist,
      year,
      genre,
      medium,
      dimensions,
      location,
      imageUrl: req.file.path,
      description,
      tags: tagsArray,
      provenance,
      price,
      priceCurrency,
      isOnDisplay,
      catalogNumber,
    });

    await newArt.save();
    return res.render("upload", {
      genres: GENRES,
      currencies: CURRENCIES,
      mediums: MEDIUMS,
      message: " Artwork uploaded successfully!",
    });
  } catch (err) {
    return res.render("upload", {
      genres: GENRES,
      currencies: CURRENCIES,
      mediums: MEDIUMS,
      message: "❌ Error: " + (err.message || "Server error"),
    });
  }
});

//fetch all painting we have
router.get("/paintings", async (req, res) => {
  try {
    const paintings = await ArtLab.find().sort({
      createdAt: -1,
    });

    res.render('paintings',{paintings});
  } catch (error) {
    res.status(400).json({
        message:error.message,
    })
  }
});

//fetch arts by artist
router.get('/artist/:artistName', async (req, res) => {
  try {
    // Decode in case of special chars
    const artistName = decodeURIComponent(req.params.artistName);
    // Find paintings by that artist (case-insensitive)
    const paintings = await ArtLab.find({ artist: new RegExp('^' + artistName + '$', 'i') }).sort({ createdAt: -1 });

    // Optionally pass artistName for the title
    res.render('artist_paintings', {
      paintings,
      artist: artistName
    });
  } catch (error) {
    res.status(500).send("Error fetching paintings: " + error.message);
  }
});




module.exports = router;
