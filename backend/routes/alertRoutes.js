const express = require("express");
const router = express.Router();
const { sendAlert } = require("../controllers/alertController");

// Route to send an alert
router.post("/send", sendAlert);

module.exports = router;
