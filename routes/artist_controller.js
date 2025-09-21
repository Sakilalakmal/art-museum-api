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

//paintings by genre
artistRouter.get('/genre/:genre',async(req,res)=>{
  try {
    const {genre} = req.params;

    const paintings = await ArtLab.find({genre:genre});

    if(paintings.length === 0){
      return res.status(400).json({
        messge :"no paintings found on this genre /n it will adding soon..."
      });
    }

    res.status(201).json(paintings);

  } catch (error) {
    res.status(400).json({
      message:error.message,
    })
    
  }


});


module.exports = artistRouter;
