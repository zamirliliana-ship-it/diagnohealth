import supabase from "../config/supabase.js";

export const requireAuth = async (
  req,
  res,
  next
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        ok: false,
        message: "No hay sesión activa.",
      });
    }

    const [type, token] =
      authorization.split(" ");

    if (
      type !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        ok: false,
        message:
          "Token de autenticación inválido.",
      });
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        ok: false,
        message:
          "La sesión no es válida o ha expirado.",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error(
      "Error verificando autenticación:",
      error
    );

    return res.status(401).json({
      ok: false,
      message:
        "No fue posible verificar el usuario.",
    });
  }
};