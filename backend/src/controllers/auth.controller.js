import { registerUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const usuario = req.body;

    const nuevoUsuario = await registerUser(usuario);

    return res.status(201).json({
      ok: true,
      message: "Usuario registrado correctamente.",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error en registro:", error);

    return res.status(400).json({
      ok: false,
      message: error.message || "No fue posible registrar el usuario.",
    });
  }
};