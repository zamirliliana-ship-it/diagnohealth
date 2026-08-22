import { registerUser, loginUser } from "../services/auth.service.js";

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
      message:
        error.message ||
        "No fue posible registrar el usuario.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const credenciales = req.body;

    const resultado = await loginUser(credenciales);

    return res.status(200).json({
      ok: true,
      message: "Inicio de sesión exitoso.",
      usuario: resultado.usuario,
      session: resultado.session,
    });

  } catch (error) {
    console.error("Error en login:", error);

    return res.status(401).json({
      ok: false,
      message:
        error.message ||
        "Correo o contraseña incorrectos.",
    });
  }
};

export const me = async (req, res) => {
  try {
    return res.status(200).json({
      ok: true,
      user: {
        id: req.user.id,
        email: req.user.email,
      },
    });

  } catch (error) {
    console.error(
      "Error obteniendo usuario:",
      error
    );

    return res.status(500).json({
      ok: false,
      message: "No fue posible obtener el usuario.",
    });
  }
};