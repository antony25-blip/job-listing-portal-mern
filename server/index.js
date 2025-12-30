require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", require("./routes/AuthRouter"));

app.get("/api/jobs", (req, res) => {
  res.json([]);
});

mongoose.connect(process.env.MONGO_CONN)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => {
      console.log("Backend running on port 5000");
    });
  })
  .catch(err => {
    console.error("MongoDB connection failed", err);
  });
