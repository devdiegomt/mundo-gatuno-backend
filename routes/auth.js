import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Límite de intentos en memoria: 5 fallos por IP cada 15 minutos.
const attempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

const isBlocked = (ip) => {
  const entry = attempts.get(ip);
  if (!entry) return false;
  if (Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.delete(ip);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
};

const registerFailure = (ip) => {
  const entry = attempts.get(ip);
  if (!entry || Date.now() - entry.firstAttempt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAttempt: Date.now() });
  } else {
    entry.count += 1;
  }
};

router.post("/login", (req, res) => {
  const ip = req.ip;

  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    console.error("Faltan ADMIN_PASSWORD o JWT_SECRET en las variables de entorno");
    return res.status(500).json({ message: "Configuración de servidor incompleta" });
  }

  if (isBlocked(ip)) {
    return res.status(429).json({
      message: "Demasiados intentos. Espera 15 minutos e intenta de nuevo.",
    });
  }

  const { password } = req.body ?? {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    registerFailure(ip);
    return res.status(401).json({ message: "Contraseña incorrecta" });
  }

  attempts.delete(ip);

  const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  res.json({ token });
});

export default router;
