const axios = require("axios");
const User = require("../models/userModel");

// Create a new product
exports.createProduct = async (req, res) => {
  const { userId, name } = req.body;
  console.log(req.body);

  if (!userId || !name) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Create product using external API
    const response = await axios.post(`${process.env.API_BASE_URL}/product`, {
      name,
    });

    const productID = response.data.productID;

    // Update the user's products array with the new product object
    await User.findByIdAndUpdate(userId, {
      $push: { products: { productId: productID, devices: [] } },
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
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ products: user.products });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: "Failed to fetch products." });
  }
};

// Create or Define Product Definition
exports.createProductDefinition = async (req, res) => {
  const { productID } = req.params; // Get productID from params
  const { productName, components } = req.body; // Get productName and components from request body

  try {
    // Assuming you need to save the definition in your database or send it to an external API
    const response = await axios.post(
      `${process.env.API_BASE_URL}/product/${productID}/definition`,
      { productID, productName, components }
    );
    console.log(response);

    res.json({
      message: "Product definition updated successfully",
      data: response.data,
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
    const response = await axios.patch(
      `${process.env.API_BASE_URL}/${productID}/components`,
      { updates }
    );

    res.json({
      message: "Components updated successfully",
      components: response.data.components, // Return the updated components
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
    const response = await axios.delete(
      `${process.env.API_BASE_URL}/${productID}/definition`
    );

    res.json({
      message: "Product definition deleted successfully",
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
    const response = await axios.delete(
      `${process.env.API_BASE_URL}/${productID}/components/${componentName}`
    );

    res.json({
      message: `Component '${componentName}' removed successfully`,
    });
  } catch (error) {
    console.error("Error deleting product component:", error.message);
    res.status(500).json({ message: "Failed to delete product component." });
  }
};
