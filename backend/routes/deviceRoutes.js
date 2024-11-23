const express = require("express");
const router = express.Router();
const {
  controlDevice,
  createDevice,
  getDevicesByProduct,
} = require("../controllers/deviceController");

//Route to create a device
router.post("/:prodID/devices", createDevice);

//Control action of device
router.post(
  "/product/:prodID/devices/control/:deviceID/:action",
  controlDevice
);

// Route to control device actions (start/stop)
router.post("/control", getDevicesByProduct);

module.exports = router;
