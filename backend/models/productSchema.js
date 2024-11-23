const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    productID: {
      type: String, // Stores productID from the external API
      required: true,
    },
    deviceIDs: {
      type: [String], // Array to store all device IDs related to the product
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
