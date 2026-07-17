import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Orígenes permitidos, separados por coma en la env var ALLOWED_ORIGINS.
// Si no está definida, se permite cualquier origen (útil en desarrollo).
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map((origin) =>
  origin.trim()
);

app.use(
  cors(
    allowedOrigins?.length
      ? {
          // Si el origen no está en la lista, simplemente no se envía el
          // header CORS y el navegador bloquea la respuesta (sin error 500).
          // Peticiones sin origin (curl, health checks) siempre pasan.
          origin: (origin, callback) =>
            callback(null, !origin || allowedOrigins.includes(origin)),
        }
      : {}
  )
);
app.use(express.json());

// Health check: útil para Render y para "despertar" el servidor
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "mundo-gatuno-backend" });
});

app.use("/api/products", productRoutes);

if (!process.env.MONGO_URI) {
  console.error("Falta la variable de entorno MONGO_URI");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en el puerto ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Error al conectar a MongoDB", err);
    process.exit(1);
  });
