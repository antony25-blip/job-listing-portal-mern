require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

app.use(express.json());

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/AuthRouter"));

// 🔹 Profile routes
app.use("/api/profile/jobseeker", require("./routes/JobSeekerProfileRouter"));
app.use("/api/profile/employer", require("./routes/EmployerProfileRouter"));


/* ================= STATIC FILES ================= */
// Resume access
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================= SAMPLE API ================= */
app.get("/api/jobs", (req, res) => {
  res.json([]);
});

/* ================= DATABASE + SERVER ================= */
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
