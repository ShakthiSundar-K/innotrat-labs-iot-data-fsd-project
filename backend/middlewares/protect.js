const jwt = require("jsonwebtoken");

// Middleware to protect routes that require authentication
const protect = (req, res, next) => {
  let token;

  // Check if token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Remove "Bearer " from token
  }

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied." });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded user to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = protect;
