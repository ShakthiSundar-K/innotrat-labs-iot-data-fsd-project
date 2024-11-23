const express = require("express");
const router = express.Router();
const { createUser } = require("../controllers/userController");

router.post("/create", createUser); // Create user route

module.exports = router;
