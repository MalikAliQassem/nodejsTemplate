const express = require("express");
const router = express.Router();
const {
  showLogin,
  showRegister,
  login,
  register,
  logout,
  getCurrentUser,
} = require("../controller/AuthController");
const { requireGuest, requireAuth } = require("../middleware/auth");

// GET /login - Display login page
router.get("/login", requireGuest, showLogin);

// GET /register - Display registration page
router.get("/register", requireGuest, showRegister);

// POST /login - Handle login
router.post("/login", requireGuest, login);

// POST /register - Handle registration
router.post("/register", requireGuest, register);

// POST /logout - Handle logout
router.post("/logout", logout);

// GET /me - Get current user (API endpoint)
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
