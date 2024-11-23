const express = require("express");
const router = express.Router();
const { sendAlert } = require("../controllers/alertController");
const protect = require("../middlewares/protect");

// Route to send an alert
router.post("/send", protect, sendAlert);

module.exports = router;
