const express = require("express");
const router = express.Router();
// const { requireAuth, requireGuest } = require("../middleware/auth");

// GET / - Home page (redirects based on auth status)
router.get("/", (req, res) => {
  if (req.session.userId) {
    res.redirect("/dashboard");
  } else {
    res.redirect("auth/login");
  }
});

// GET /about - About page
router.get("/about", (req, res) => {
  res.render("about", {
    title: "About TestApp",
    description: "A Node.js application following MVC architecture",
  });
});

module.exports = router;
