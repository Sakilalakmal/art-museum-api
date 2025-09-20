const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { route } = require("./routes/artAdd_controller");
const router = require("./routes/artAdd_controller");
dotenv.config();
const path = require('path');
const cors = require('cors');
const artistRouter = require("./routes/artist_controller");

//port
const PORT = process.env.PORT || 5000;

//initialize express app
const app = express();

//midlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//server static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



//connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("mongoDB connect sucessfully ..✅");
  })
  .catch((error) => {
    console.log(error);
  });


//import routes
app.use('/api/artworks',router);
app.use('/api/artists',artistRouter);

//server runn

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}/api/artworks`);
});
