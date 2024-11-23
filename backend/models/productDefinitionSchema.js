const mongoose = require("mongoose");

const productDefinitionSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
    },
    components: {
      type: Object, // Stores the product definition components
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductDefinition", productDefinitionSchema);
