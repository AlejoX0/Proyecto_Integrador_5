import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token requerido para acceder" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
  }
}
