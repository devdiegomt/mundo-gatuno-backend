import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    console.log("Productos encontrados:", products); // Verifica los productos aquí
    if (products.length === 0)
      return res.status(404).json({ message: "No hay productos" });
    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos:", err); // Verifica cualquier error
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

export default router;