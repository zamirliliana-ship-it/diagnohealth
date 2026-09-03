import {
  registerUser,
  loginUser,
  recuperarPassword as recuperarPasswordService,
  restablecerPassword as restablecerPasswordService,
} from "../services/auth.service.js";

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

export const recuperarPassword = async (req, res) => {
  try {
    const { correo, redirectTo } = req.body;

    await recuperarPasswordService(
      correo,
      redirectTo
    );

    return res.status(200).json({
      ok: true,
      message:
        "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam.",
    });

  } catch (error) {
    console.error(
      "Error en recuperación de contraseña:",
      error
    );

    const mensaje = error.message || "";
    const esLimite =
      mensaje.toLowerCase().includes("espera unos minutos");

    return res.status(esLimite ? 429 : 400).json({
      ok: false,
      message:
        mensaje ||
        "No fue posible procesar la solicitud de recuperación.",
    });
  }
};

export const restablecerPassword = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    const authorization =
      req.headers.authorization || "";

    const accessToken = authorization.startsWith(
      "Bearer "
    )
      ? authorization.slice(7)
      : "";

    await restablecerPasswordService({
      password,
      confirmPassword,
      accessToken,
    });

    return res.status(200).json({
      ok: true,
      message:
        "Tu contraseña fue actualizada correctamente.",
    });

  } catch (error) {
    console.error(
      "Error restableciendo contraseña:",
      error
    );

    const mensaje = error.message || "";
    const enlaceInvalido = mensaje
      .toLowerCase()
      .includes("enlace de recuperación");

    return res.status(enlaceInvalido ? 401 : 400).json({
      ok: false,
      message:
        mensaje ||
        "No fue posible actualizar la contraseña.",
    });
  }
};