import supabase from "../config/supabase.js";

// ============================================================
// REGISTRO DE USUARIO
// ============================================================

export const registerUser = async (usuario) => {
  const {
    tipo_documento,
    numero_documento,
    nombres,
    apellidos,
    correo,
    telefono,
    genero,
    password,
  } = usuario;

  // ==========================================================
  // VALIDACIONES BÁSICAS
  // ==========================================================

  if (!correo || !password) {
    throw new Error(
      "El correo y la contraseña son obligatorios."
    );
  }

  const email = correo.trim().toLowerCase();

  if (!/\S+@\S+\.\S+/.test(email)) {
    throw new Error(
      "Ingresa un correo electrónico válido."
    );
  }

  if (password.length < 6) {
    throw new Error(
      "La contraseña debe tener al menos 6 caracteres."
    );
  }

  if (!nombres?.trim()) {
    throw new Error(
      "Los nombres son obligatorios."
    );
  }

  if (!apellidos?.trim()) {
    throw new Error(
      "Los apellidos son obligatorios."
    );
  }

  // ==========================================================
  // CREAR USUARIO EN SUPABASE
  // ==========================================================

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          tipo_documento:
            tipo_documento?.trim() || null,

          numero_documento:
            numero_documento?.trim() || null,

          nombres:
            nombres.trim(),

          apellidos:
            apellidos.trim(),

          telefono:
            telefono?.trim() || null,

          genero:
            genero || null,
        },
      },
    });

  // ==========================================================
  // ERROR DE SUPABASE
  // ==========================================================

  if (error) {
    console.error(
      "Error de Supabase en registro:",
      error
    );

    throw new Error(
      traducirErrorRegistro(error.message)
    );
  }

  if (!data.user) {
    throw new Error(
      "No fue posible crear el usuario."
    );
  }

  // ==========================================================
  // RESPUESTA
  // ==========================================================

  return {
    id: data.user.id,

    correo: data.user.email,

    nombres: nombres.trim(),

    apellidos: apellidos.trim(),

    emailConfirmado:
      !!data.user.email_confirmed_at,
  };
};


// ============================================================
// LOGIN
// ============================================================

export const loginUser = async (credenciales) => {
  const { correo, password } = credenciales;

  if (!correo || !password) {
    throw new Error(
      "Correo y contraseña son obligatorios."
    );
  }

  const email = correo.trim().toLowerCase();

  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    console.error(
      "Error de Supabase en login:",
      error
    );

    throw new Error(
      "Correo o contraseña incorrectos."
    );
  }

  if (!data.user || !data.session) {
    throw new Error(
      "No fue posible iniciar sesión."
    );
  }

  return {
    usuario: {
      id: data.user.id,

      correo: data.user.email,

      ...data.user.user_metadata,
    },

    session: {
      access_token:
        data.session.access_token,

      refresh_token:
        data.session.refresh_token,

      expires_at:
        data.session.expires_at,
    },
  };
};


// ============================================================
// TRADUCIR ERRORES DE REGISTRO
// ============================================================

const traducirErrorRegistro = (mensaje = "") => {
  const error = mensaje.toLowerCase();

  if (
    error.includes("already registered") ||
    error.includes("already been registered")
  ) {
    return (
      "Ya existe una cuenta registrada con este correo electrónico."
    );
  }

  if (
    error.includes("password")
  ) {
    return (
      "La contraseña no cumple con los requisitos de seguridad."
    );
  }

  if (
    error.includes("rate limit") ||
    error.includes("too many requests")
  ) {
    return (
      "Has realizado demasiados intentos. Espera unos minutos antes de intentarlo nuevamente."
    );
  }

  return (
    "No fue posible completar el registro. Inténtalo nuevamente."
  );
};