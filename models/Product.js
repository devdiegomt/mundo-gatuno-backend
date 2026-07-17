import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Sin _id manual: Mongoose genera un ObjectId automáticamente,
    // lo que evita colisiones cuando dos productos comparten aroma.
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
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
