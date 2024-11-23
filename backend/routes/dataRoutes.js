const express = require("express");
const router = express.Router();
const {
  generateDataForUser,
  getDataForUser,
} = require("../controllers/dataController");

// Route to generate data for specific devices
router.post("/generate", generateDataForUser);

// Route to get data for a product
router.get("/:prodID/data", getDataForUser);

module.exports = router;
