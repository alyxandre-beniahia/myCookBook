const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

// Import route files
const authRoutes = require("./routes/authRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const userRoutes = require("./routes/userRoutes");
const commentRoutes = require("./routes/commentRoutes");

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Security middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(mongoSanitize()); // Prevents NoSQL injection

// // Apply general rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use("/api/", limiter);

// // Add a specific rate limiter for ratings endpoints with higher limits
// const ratingsLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 200, // higher limit for ratings
//   message: "Too many rating requests, please try again later.",
// });

// // Apply ratings limiter to the ratings endpoints
// app.use("/api/recipes/:id/ratings", ratingsLimiter);

// // Add this after your existing rate limiter
// const authLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 10, // 10 registration/login attempts per hour
//   message: "Too many authentication attempts, please try again later.",
// });

// Apply it before your routes
// app.use("/api/auth/register", authLimiter);
// app.use("/api/auth/login", authLimiter);

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/recipes/:recipeId/comments", commentRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
