const express = require("express");
const router = express.Router();
const protect = require("../middlewares/protect");

const {
  controlDevice,
  createDevice,
  getDevicesByProduct,
} = require("../controllers/deviceController");

//Route to create a device
router.post("/:prodID/devices", protect, createDevice);

//Control action of device
router.post(
  "/product/:prodID/devices/control/:deviceID/:action",
  protect,
  controlDevice
);

// Route to control device actions (start/stop)
router.post("/control", protect, getDevicesByProduct);

module.exports = router;
