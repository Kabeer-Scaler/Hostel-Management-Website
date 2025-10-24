require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db.js");
const passport = require('passport');
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const roomRoutes = require("./routes/roomRoutes.js");
const complaintRoutes = require("./routes/complaintRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes.js");
const messRoutes = require("./routes/messRoutes.js")


const app = express();
connectDB();

require('./config/passport.js')(passport);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/mess", messRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/complaints", complaintRoutes);


// Default route
app.get("/", (req, res) => {
  res.send("🏠 Hostel Management API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
