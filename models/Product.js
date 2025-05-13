import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  aroma: { type: String, required: true },
  presentations: [
    {
      weight: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

export default Product;
