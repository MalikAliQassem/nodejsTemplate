const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware/auth");

// GET /dashboard - Display dashboard for authenticated users
router.get("/dashboard", requireAuth, (req, res) => {
  res.render("dashboard", {
    title: "Dashboard",
    userName: req.session.userName,
  });
});

module.exports = router;
