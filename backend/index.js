const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const productRoutes = require("./routes/productRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const dataRoutes = require("./routes/dataRoutes");
const alertRoutes = require("./routes/alertRoutes");
const userRoutes = require("./routes/userRoutes");
const cron = require("node-cron");
const socketIo = require("socket.io"); // Import Socket.io
const { generateData, getData } = require("./controllers/dataController");
const { controlDevice } = require("./controllers/deviceController");

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

// Cron Job - Periodic task every minute
// cron.schedule("* * * * * *", async () => {
//   try {
//     const productID = "your-product-id"; // You may need to dynamically pass this or fetch from DB

//     // Step 1: Generate new sensor data for the product
//     console.log("Generating new sensor data...");
//     await generateData({ body: { deviceIds: [productID] } });

//     // Step 2: Fetch the updated sensor data for the product
//     console.log("Fetching updated sensor data...");
//     const data = await getData({ params: { prodID: productID } });
//     const { temperature, humidity, gasLevel } = data;

//     // Step 3: Apply threshold logic

//     // Temperature threshold check
//     if (temperature > process.env.TEMPERATURE_THRESHOLD) {
//       console.log("Temperature exceeds threshold! Activating cooling...");
//       //   await controlDevice(productID, [
//       //     { deviceID: "cooling-device-id", action: "start" },
//       //   ]);

//       // Emit to frontend using Socket.io
//       io.emit("temperature-alert", {
//         message: `Temperature exceeds threshold! Current temperature: ${temperature}°C`,
//       });
//     }

//     // Humidity threshold check
//     if (humidity > process.env.HUMIDITY_THRESHOLD) {
//       console.log("Humidity exceeds threshold! Sending alert...");

//       // Emit to frontend using Socket.io
//       io.emit("humidity-alert", {
//         message: `Humidity exceeds threshold! Current humidity: ${humidity}%`,
//       });
//     }

//     // Gas level threshold check
//     if (gasLevel > process.env.GAS_THRESHOLD) {
//       console.log("Gas level exceeds threshold! Sending alert...");

//       // Emit to frontend using Socket.io
//       io.emit("gas-level-alert", {
//         message: `Gas level exceeds threshold! Current gas level: ${gasLevel} ppm`,
//       });
//     }
//   } catch (error) {
//     console.error("Error in periodic task:", error.message);
//   }
// });

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
