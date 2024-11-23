const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    deviceID: {
      type: String, // Stores deviceID from the external API
      required: true,
    },
    status: {
      type: String,
      enum: ["running", "stopped"], // Locally stores device status
      default: "stopped",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", deviceSchema);
