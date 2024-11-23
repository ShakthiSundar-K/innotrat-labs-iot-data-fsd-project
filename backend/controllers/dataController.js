const axios = require("axios");
const User = require("../models/userModel");

// Generate data for running devices
exports.generateDataForUser = async (req, res) => {
  const { userID } = req.params;

  try {
    // Fetch the user by ID
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Collect all device IDs from user's products
    const allDeviceIds = user.products.reduce((deviceIds, product) => {
      return deviceIds.concat(product.devices);
    }, []);

    if (allDeviceIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No devices found for this user." });
    }

    // Check if devices are running
    const checkRunningResponse = await axios.post(
      "https://eureka.innotrat.in/devices/running",
      {
        productID: user.products.map((product) => product.productId), // All product IDs
      }
    );

    const runningDevices = checkRunningResponse.data.runningDevices || [];
    if (runningDevices.length === 0) {
      return res.status(400).json({
        message: "No devices are currently running. Unable to generate data.",
      });
    }

    // Extract running device IDs
    const runningDeviceIds = runningDevices.map((device) => device.deviceID);

    // Generate data only for running devices
    const generateDataResponse = await axios.post(
      "https://eureka.innotrat.in/device/generate_data",
      {
        deviceIds: runningDeviceIds,
      }
    );

    res.json({
      message: "Data generated successfully.",
      runningDevicesCount: runningDeviceIds.length,
      details: generateDataResponse.data,
    });
  } catch (error) {
    console.error("Error generating data:", error.message);
    res.status(500).json({ message: "Failed to generate data." });
  }
};

// Get data for a product
exports.getDataForUser = async (req, res) => {
  const { userID } = req.params; // Retrieve the user ID from the request params

  try {
    // Fetch the user's product details
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const productIDs = user.products.map((product) => product.productId); // Extract product IDs

    if (productIDs.length === 0) {
      return res
        .status(400)
        .json({ message: "No products associated with this user." });
    }

    // Fetch data for each product
    const productDataPromises = productIDs.map(async (prodID) => {
      try {
        const response = await axios.get(
          `${process.env.API_BASE_URL}/product/${prodID}/data`
        );
        return { prodID, data: response.data };
      } catch (error) {
        console.error(
          `Error fetching data for product ${prodID}:`,
          error.message
        );
        return { prodID, error: "Failed to fetch data." };
      }
    });

    // Resolve all promises
    const productDataResults = await Promise.all(productDataPromises);

    // Separate successful and failed results
    const successfulData = productDataResults.filter((result) => !result.error);
    const failedData = productDataResults.filter((result) => result.error);

    res.json({
      message: "Data fetch completed.",
      successfulData,
      failedData,
    });
  } catch (error) {
    console.error("Error fetching data for user:", error.message);
    res.status(500).json({ message: "Failed to fetch data for user." });
  }
};
