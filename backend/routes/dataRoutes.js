const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");

const {
  generateDataForUser,
  getDataForUser,
} = require("../controllers/dataController");

// Route to generate data for specific devices
router.post("/generate", protect, generateDataForUser);

// Route to get data for a product
router.get("/:prodID/data", protect, getDataForUser);

module.exports = router;
