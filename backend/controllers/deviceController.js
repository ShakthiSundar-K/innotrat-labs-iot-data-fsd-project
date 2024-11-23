const axios = require("axios");
const Product = require("../models/productSchema");

// Create devices for a product
exports.createDevice = async (req, res) => {
  const { prodID } = req.params; // Product ID from URL
  const { id } = req.user; // User ID from authentication
  const { deviceCount } = req.body; // Device count from request body

  if (!deviceCount || deviceCount <= 0) {
    return res.status(400).json({ message: "Invalid device count." });
  }

  try {
    // Make the API call to create devices
    const response = await axios.post(
      `https://eureka.innotrat.in/product/${prodID}/devices`,
      {
        deviceCount: deviceCount,
      }
    );

    const addedDevices = response.data.addedDevices;

    if (!addedDevices || addedDevices.length === 0) {
      return res.status(500).json({ message: "Failed to create devices." });
    }

    // Find the product by productID
    const product = await Product.findOne({ productID: prodID, user: id });

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Add the new device IDs to the product's deviceIDs array
    product.deviceIDs.push(...addedDevices);

    // Save the updated product
    await product.save();

    // Respond with the added devices
    res.status(201).json({
      message: `${deviceCount} device(s) created successfully.`,
      addedDevices: addedDevices,
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
