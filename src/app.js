const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3000;

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Import authentication middleware
const { addUserToLocals } = require("./middleware/auth");

// Add user info to all templates
app.use(addUserToLocals);
  
// Routes
app.use("/", require("./routes/index"));
app.use("/", require("./routes/dashboard"));
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/api"));
 
// Error handling middleware
app.use((err, req, res,next) => {
  console.error("Error:", err);
  res?.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || "Internal server error",
      code: err.code || "INTERNAL_ERROR",
    },
  });
  next(err);
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      code: "NOT_FOUND",
    },
  });
});

app.listen(PORT, (err) => {
  console.log(`S========= ${err}`);
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
