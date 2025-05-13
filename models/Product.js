import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  aroma: { type: String },
  quantity: { type: Number },
  image: { type: String },
  weights: { type: [String] },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
