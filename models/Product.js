import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  aroma: String,
  quantity: Number,
  image: String,
});

export default mongoose.model("Product", productSchema);
