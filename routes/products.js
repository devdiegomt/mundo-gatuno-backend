import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0)
      return res.status(404).json({ message: "No hay productos" });
    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos: ", err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(400).json({ message: "Error al crear el producto", error: err });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error al actualizar el producto", error: err });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: err });
  }
});

export default router;
