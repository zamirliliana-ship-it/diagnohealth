export const validateRegister = (req, res, next) => {
  const {
    tipo_documento,
    numero_documento,
    nombres,
    apellidos,
    correo,
    telefono,
    genero,
    password,
  } = req.body;

  if (
    !tipo_documento ||
    !numero_documento ||
    !nombres ||
    !apellidos ||
    !correo ||
    !telefono ||
    !genero ||
    !password
  ) {
    return res.status(400).json({
      ok: false,
      message: "Todos los campos son obligatorios.",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      ok: false,
      message: "La contraseña debe tener mínimo 6 caracteres.",
    });
  }

  next();
};