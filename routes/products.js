import express from "express";
import Product from "../models/Product.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Público: lo consume la tienda
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    // Sin productos no es un error: se responde lista vacía con 200
    res.json(products);
  } catch (err) {
    console.error("Error al obtener productos: ", err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

// Protegido: solo el admin con token
router.post("/", requireAdmin, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Error al crear el producto: ", err);
    res.status(400).json({ message: "Error al crear el producto" });
  }
});

router.put("/:id", requireAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (err) {
    console.error("Error al actualizar el producto: ", err);
    res.status(400).json({ message: "Error al actualizar el producto" });
  }
});

router.delete("/:id", requireAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar el producto: ", err);
    res.status(500).json({ message: "Error al eliminar el producto" });
  }
});

export default router;
