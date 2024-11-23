const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const protect = require("../middlewares/protect");

// Route to get all products
router.get("/", protect, productController.getProducts);

// Route to create a new product
router.post("/createProduct", protect, productController.createProduct);

// Create or define product definition
router.post(
  "/product/:productID/definition",
  protect,
  productController.createProductDefinition
);

// Get product definition
router.get(
  "/product/:productID/definition",
  protect,
  productController.getProductDefinition
);

// Update components
router.patch(
  "/product/:productID/components",
  protect,
  productController.updateProductComponents
);

// Delete product definition
router.delete(
  "/product/:productID/definition",
  protect,
  productController.deleteProductDefinition
);

// Delete particular component
router.delete(
  "/product/:productID/components/:componentName",
  protect,
  productController.deleteProductComponent
);

module.exports = router;
