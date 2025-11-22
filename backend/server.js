import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import Stripe from "stripe"


dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// middleware
app.use(cors());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL}));


// routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Welcome to E-commerce API");
});

// mongo connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
