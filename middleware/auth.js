export const requireAdmin = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!process.env.ADMIN_TOKEN) {
    console.error("ADMIN_TOKEN no está configurado en las variables de entorno");
    return res.status(500).json({ message: "Configuración de servidor incompleta" });
  }

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: "No autorizado" });
  }

  next();
};
