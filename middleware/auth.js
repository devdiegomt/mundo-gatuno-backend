import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET no está configurado en las variables de entorno");
    return res.status(500).json({ message: "Configuración de servidor incompleta" });
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "admin") {
      return res.status(401).json({ message: "No autorizado" });
    }
    next();
  } catch {
    // Token inválido o expirado
    return res.status(401).json({ message: "Sesión expirada, inicia sesión de nuevo" });
  }
};
