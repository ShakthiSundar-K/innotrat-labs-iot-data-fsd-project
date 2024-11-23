const axios = require("axios");

// Send an alert
exports.sendAlert = async (req, res) => {
  const { prodID, message } = req.body;

  if (!prodID || !message) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const response = await axios.post(`${process.env.API_BASE_URL}/alert`, {
      prodID,
      message,
    });
    res.json({ message: "Alert sent successfully.", details: response.data });
  } catch (error) {
    console.error("Error sending alert:", error.message);
    res.status(500).json({ message: "Failed to send alert." });
  }
};

// Get alerts for a product
exports.getAlerts = async (req, res) => {
  const { prodID } = req.params;

  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/product/${prodID}/alerts`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching alerts:", error.message);
    res.status(500).json({ message: "Failed to fetch alerts." });
  }
};
