const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true }, // Store product ID
      devices: [{ type: String }], // Array of associated device IDs
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
