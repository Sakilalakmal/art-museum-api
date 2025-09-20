const express = require("express");
const ArtLab = require("../models/ArtLab");
const artistRouter = express.Router();

// auto complete artist

artistRouter.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";
    if (!search) return res.json({ artists: [] });

    const regex = new RegExp("^" + search, "i");
    const artists = await ArtLab.find({ artist: { $regex: regex } }).distinct(
      "artist"
    );
    res.json({ artists });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = artistRouter;
