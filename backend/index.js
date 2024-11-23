const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const productRoutes = require("./routes/productRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const dataRoutes = require("./routes/dataRoutes");
const alertRoutes = require("./routes/alertRoutes");
const userRoutes = require("./routes/userRoutes");
const cron = require("node-cron");
const axios = require("axios");
const socketIo = require("socket.io"); // Import Socket.io
const ProductDefinition = require("./models/productDefinitionSchema");
const Product = require("./models/productSchema");

dotenv.config(); // Load environment variables

const app = express();

// Setup Socket.io server
const server = require("http").createServer(app);
const io = socketIo(server); // Attach socket.io to the server

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/alerts", alertRoutes);

// Function to generate and fetch data for all products
const generateAndFetchData = async () => {
  try {
    console.log("Generating and fetching data...");
    // Get all products
    const products = await Product.find();

    for (const product of products) {
      const { _id, productID } = product;

      // Fetch product definition for this product
      const productDefinition = await ProductDefinition.findOne({
        product: productID,
      });
      if (!productDefinition) {
        console.error(`No product definition found for product: ${productID}`);
        continue;
      }

      const { components } = productDefinition;

      // Generate data using external API
      await axios.post(`https://eureka.innotrat.in/generate_data`, {
        productID,
      });

      // Fetch generated data
      const response = await axios.post(`https://eureka.innotrat.in/get_data`, {
        productID,
      });
      const dataEntries = response.data.data;

      // Check thresholds dynamically for each component
      for (const entry of dataEntries) {
        console.log(entry);
        Object.keys(components).forEach((component) => {
          const { range } = components[component];
          if (range) {
            const value = parseFloat(entry[component]);
            if (value < range.min || value > range.max) {
              console.log(
                `Threshold alert: ${component} value (${value}) is out of range (${range.min}-${range.max}) for product ${productID}`
              );

              // Send real-time alerts via Socket.IO
              io.emit("thresholdAlert", {
                productID,
                component,
                value,
                range,
                timestamp: entry.Timestamp,
              });
            }
          }
        });
      }
    }
  } catch (error) {
    console.error("Error generating or fetching data:", error.message);
  }
};
generateAndFetchData();
// Schedule the cron job to run every second
cron.schedule("* * * * *", generateAndFetchData);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
