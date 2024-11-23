// routes/userRoutes.js

const express = require("express");
const router = express.Router();
const { loginUser, registerUser } = require("../controllers/userController");

// User Routes
router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
