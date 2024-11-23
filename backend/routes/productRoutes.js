const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to get all products
router.get("/", productController.getProducts);

// Route to create a new product
router.post("/createProduct", productController.createProduct);

// Create or define product definition
router.post(
  "/product/:productID/definition",
  productController.createProductDefinition
);

// Get product definition
router.get(
  "/product/:productID/definition",
  productController.getProductDefinition
);

// Update components
router.patch(
  "/product/:productID/components",
  productController.updateProductComponents
);

// Delete product definition
router.delete(
  "/product/:productID/definition",
  productController.deleteProductDefinition
);

// Delete particular component
router.delete(
  "/product/:productID/components/:componentName",
  productController.deleteProductComponent
);

module.exports = router;
