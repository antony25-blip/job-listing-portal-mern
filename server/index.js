const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/jobs", (req, res) => {
  res.json([
    { id: 1, title: "Frontend Developer", company: "Google", location: "Remote", type: "Full-time" },
    { id: 2, title: "Backend Developer", company: "Amazon", location: "Bangalore", type: "Full-time" },
    { id: 3, title: "UI Designer", company: "Microsoft", location: "Chennai", type: "Internship" }
  ]);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
