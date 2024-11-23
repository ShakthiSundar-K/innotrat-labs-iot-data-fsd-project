const axios = require("axios");
const User = require("../models/userModel");

// Create devices for a product
exports.createDevice = async (req, res) => {
  const { userID, prodID } = req.params;
  const { deviceCount } = req.body;

  if (!deviceCount || deviceCount <= 0) {
    return res.status(400).json({ message: "Invalid device count." });
  }

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const product = user.products.find((p) => p.productId === prodID);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Create device IDs
    const newDevices = [];
    for (let i = 0; i < deviceCount; i++) {
      const deviceId = `device-${Math.random().toString(36).substr(2, 9)}`;
      newDevices.push(deviceId);
    }

    // Add new device IDs to the product's devices array
    product.devices.push(...newDevices);

    // Save the user document
    await user.save();

    res.status(201).json({
      message: `${deviceCount} device(s) created successfully.`,
      devices: newDevices,
    });
  } catch (error) {
    console.error("Error creating devices:", error.message);
    res.status(500).json({ message: "Failed to create devices." });
  }
};

// Get all devices for a product
exports.getDevicesByProduct = async (req, res) => {
  const { prodID } = req.params;

  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/product/${prodID}/devices`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching devices:", error.message);
    res.status(500).json({ message: "Failed to fetch devices." });
  }
};

//Control a device

exports.controlDevice = async (req, res) => {
  const { prodID, deviceID, action } = req.params; // Get product ID, deviceID, and action from URL params

  if (!deviceID || !action) {
    return res
      .status(400)
      .json({ message: "Device ID and action are required." });
  }

  // Validate action (either start or stop)
  if (action !== "start" && action !== "stop") {
    return res
      .status(400)
      .json({ message: "Invalid action. It must be 'start' or 'stop'." });
  }

  try {
    // Prepare the device control data in an array format
    const controlData = [{ deviceID, action }];

    // Send request to the external API for controlling the device
    const response = await axios.post(
      `${process.env.API_BASE_URL}/product/${prodID}/devices/control`, // URL with prodID
      { devices: controlData } // Sending the control data for the device as an array
    );

    res.json({
      message: "Device control operation completed.",
      updatedDevices: response.data.updatedDevices,
      notFoundDevices: response.data.notFoundDevices,
    });
  } catch (error) {
    console.error("Error controlling device:", error.message);
    res.status(500).json({ message: "Failed to control device." });
  }
};
