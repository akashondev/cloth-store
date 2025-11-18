import mongoose from "mongoose";

const newProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  images: {
    type: [String], // array of image URLs
    validate: [(val) => val.length >= 1, "At least one image is required"],
  },
});

const Product = mongoose.model("NewProduct", newProductSchema);
export default Product;
