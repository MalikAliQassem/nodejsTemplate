const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const { requireAuth } = require("../middleware/auth");

// User routes (protected)
router.get("/users", requireAuth, userController.getUsers);
router.get("/users/:id", requireAuth, userController.getUserById);
router.post("/users", requireAuth, userController.createUser);
router.put("/users/:id", requireAuth, userController.updateUser);
router.delete("/users/:id", requireAuth, userController.deleteUser);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
