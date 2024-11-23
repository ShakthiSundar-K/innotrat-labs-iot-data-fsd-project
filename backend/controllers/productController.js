const axios = require("axios");
const Product = require("../models/productSchema");
const ProductDefinition = require("../models/productDefinitionSchema");

// Create a new product
exports.createProduct = async (req, res) => {
  const { name } = req.body;
  const user = req.user.id;

  if (!user || !name) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Create product using external API
    const response = await axios.post(`${process.env.API_BASE_URL}/product`, {
      name,
    });

    const productID = response.data.productID;

    const product = await Product.create({
      user,
      name: response.data.name,
      productID: response.data.productID,
    });

    res.json({ message: "Product created successfully.", productID });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ message: "Failed to create product." });
  }
};

// Get all products for a user
exports.getProducts = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = req.user.id;
    const products = await Product.find({ user });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Create or Define Product Definition
exports.createProductDefinition = async (req, res) => {
  const { productID } = req.params; // Get productID from params
  const { ProductName, components } = req.body; // Get productName and components from request body
  console.log(ProductName);
  try {
    // Log the received productID for debugging
    console.log("Received productID:", productID);

    // Assuming you need to save the definition in your database or send it to an external API
    const response = await axios.post(
      `${process.env.API_BASE_URL}/product/${productID}/definition`,
      { productID, name: ProductName, components }
    );
    console.log("API response:", response.data);

    // Cast productID to string explicitly if needed
    const productDefinition = await ProductDefinition.create({
      product: String(productID), // Explicitly convert to string here
      name: ProductName,
      components: req.body.components,
    });

    res.json({
      message: "Product definition updated successfully",
      data: productDefinition,
    });
  } catch (error) {
    console.error("Error creating product definition:", error.message);
    res.status(500).json({ message: "Failed to create product definition." });
  }
};

// Get Product Definition
exports.getProductDefinition = async (req, res) => {
  const { productID } = req.params; // Get productID from params
  console.log(productID);
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/product/${productID}/definition`
    );

    res.json(response.data); // Returning the product definition from the API response
  } catch (error) {
    console.error("Error fetching product definition:", error.message);
    res.status(500).json({ message: "Failed to get product definition." });
  }
};

// Update Components
exports.updateProductComponents = async (req, res) => {
  const { productID } = req.params; // Get productID from params
  const { updates } = req.body; // Get updates from the request body

  try {
    // Update components in the external API
    const response = await axios.patch(
      `${process.env.API_BASE_URL}/product/${productID}/components`,
      { updates }
    );

    // Update components in the local database
    const updatedDefinition = await ProductDefinition.findOneAndUpdate(
      { product: productID },
      { $set: { components: { ...response.data.components } } }, // Update with the new components
      { new: true } // Return the updated document
    );

    if (!updatedDefinition) {
      return res
        .status(404)
        .json({ message: "Product definition not found in the database." });
    }

    res.json({
      message: "Components updated successfully.",
      components: updatedDefinition.components, // Return the updated components from the database
    });
  } catch (error) {
    console.error("Error updating components:", error.message);
    res.status(500).json({ message: "Failed to update components." });
  }
};

// Delete Product Definition
exports.deleteProductDefinition = async (req, res) => {
  const { productID } = req.params; // Get productID from params

  try {
    // Delete the definition in the external API
    const response = await axios.delete(
      `${process.env.API_BASE_URL}/product/${productID}/definition`
    );

    // Delete the definition from the local database
    const deletedDefinition = await ProductDefinition.findOneAndDelete({
      product: productID,
    });

    if (!deletedDefinition) {
      return res
        .status(404)
        .json({ message: "Product definition not found in the database." });
    }

    res.json({
      message: "Product definition deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting product definition:", error.message);
    res.status(500).json({ message: "Failed to delete product definition." });
  }
};

// Delete Particular Component
exports.deleteProductComponent = async (req, res) => {
  const { productID, componentName } = req.params; // Get productID and componentName from params

  try {
    // Delete the component in the external API
    const response = await axios.delete(
      `${process.env.API_BASE_URL}/product/${productID}/components/${componentName}`
    );

    // Update the database to remove the component
    const updatedDefinition = await ProductDefinition.findOneAndUpdate(
      { product: productID },
      { $unset: { [`components.${componentName}`]: "" } }, // Remove the specific component
      { new: true } // Return the updated document
    );

    if (!updatedDefinition) {
      return res
        .status(404)
        .json({ message: "Product definition not found in the database." });
    }

    res.json({
      message: `Component '${componentName}' removed successfully.`,
      components: updatedDefinition.components, // Return the updated components from the database
    });
  } catch (error) {
    console.error("Error deleting product component:", error.message);
    res.status(500).json({ message: "Failed to delete product component." });
  }
};
