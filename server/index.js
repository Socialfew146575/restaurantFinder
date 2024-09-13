require("dotenv").config();
const express = require("express");
const app = express();
const {connectToDB} = require('./db')
const morgan = require("morgan")
const cors = require('cors')


const PORT = process.env.PORT || 8000;
const restaurantRouter = require("./routes/restaurants");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://restaurant-finder-cyan.vercel.app",
    ],
  })
);

app.use(express.json())
app.use(morgan("dev"))
app.use("/api/v1/restaurants", restaurantRouter);



app.get("/", (req, res) => {
  res.send("Welcome to YELP");
});

connectToDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error starting server:", error);
    process.exit(1); // Exit the process with a failure code
  });