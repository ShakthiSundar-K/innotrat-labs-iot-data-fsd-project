const User = require("../models/userModel");

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    const user = new User({ name, email, password });
    await user.save();

    res.json({ message: "User created successfully.", user });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ message: "Failed to create user." });
  }
};
