import { useEffect, useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  LoaderCircle,
  LogIn,
} from "lucide-react";

import { supabase } from "../../config/supabase";

function InicioS() {
  const navigate = useNavigate();
  const location = useLocation();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // =========================================================
  // SI YA ESTÁ AUTENTICADO
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          navigate("/chatbot", {
            replace: true,
          });
        }
      } catch (error) {
        console.error(
          "Error verificando sesión:",
          error
        );
      }
    };

    checkSession();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const email = correo.trim();

    if (!email || !password) {
      setErrorMessage(
        "Ingresa tu correo y contraseña."
      );

      return;
    }

    setLoading(true);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data?.session) {
        throw new Error(
          "No se pudo iniciar la sesión."
        );
      }

      setSuccessMessage(
        "Sesión iniciada correctamente."
      );

      // Si venía de una ruta protegida,
      // regresamos allí.
      const destination =
        location.state?.from ||
        "/chatbot";

      navigate(destination, {
        replace: true,
        state: {},
      });

    } catch (error) {
      console.error(
        "Error iniciando sesión:",
        error
      );

      setErrorMessage(
        error.message ||
          "No fue posible iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RECUPERAR CONTRASEÑA
  // =========================================================

  const handleForgotPassword = () => {
    const email = correo.trim();

    navigate("/recuperar-password", {
      state: {
        email,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">

          <Link
            to="/"
            className="flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0C4A6E] font-bold text-white">
              D
            </div>

            <span className="text-lg font-bold text-[#0C4A6E]">
              DIAGNOHEALTH
            </span>

          </Link>

          <Link
            to="/registro"
            className="text-sm font-semibold text-[#0369A1] hover:text-[#0C4A6E]"
          >
            Crear cuenta
          </Link>

        </div>

      </header>

      {/* =====================================================
          LOGIN
      ====================================================== */}

      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

            {/* ICONO / TÍTULO */}

            <div className="mb-8 text-center">

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#E0F2FE] text-[#0369A1]">
                <LogIn size={26} />
              </div>

              <h1 className="text-2xl font-bold text-[#00334F]">
                Bienvenido de nuevo
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Inicia sesión para continuar en DiagnoHealth.
              </p>

            </div>

            {/* MENSAJE DE ERROR */}

            {errorMessage && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {errorMessage}
              </div>
            )}

            {/* MENSAJE DE ÉXITO */}

            {successMessage && (
              <div
                role="status"
                className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
              >
                {successMessage}
              </div>
            )}

            {/* FORMULARIO */}

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* CORREO */}

              <div>

                <label
                  htmlFor="correo"
                  className="mb-2 block text-sm font-medium text-[#00334F]"
                >
                  Correo electrónico
                </label>

                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(event) =>
                    setCorreo(event.target.value)
                  }
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/10 disabled:bg-gray-100"
                />

              </div>

              {/* CONTRASEÑA */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#00334F]"
                  >
                    Contraseña
                  </label>

                  {/* ================================
                      OLVIDASTE TU CONTRASEÑA
                  ================================= */}

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-xs font-medium text-[#0369A1] hover:text-[#0C4A6E] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Ingresa tu contraseña"
                    autoComplete="current-password"
                    disabled={loading}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/10 disabled:bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0369A1] disabled:cursor-not-allowed"
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              {/* BOTÓN INICIAR SESIÓN */}

              <button
                type="submit"
                disabled={
                  loading ||
                  !correo.trim() ||
                  !password
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0369A1] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0C4A6E] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="animate-spin"
                    />

                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <LogIn size={19} />

                    Iniciar sesión
                  </>
                )}

              </button>

            </form>

            {/* REGISTRO */}

            <div className="mt-7 border-t border-gray-200 pt-6 text-center">

              <p className="text-sm text-gray-500">
                ¿Todavía no tienes una cuenta?
              </p>

              <Link
                to="/registro"
                className="mt-1 inline-block text-sm font-semibold text-[#0369A1] hover:text-[#0C4A6E]"
              >
                Crear una cuenta
              </Link>

            </div>

          </div>

          <p className="mt-5 text-center text-xs text-gray-400">
            Tu sesión se gestiona de forma segura mediante Supabase.
          </p>

        </div>

      </main>

    </div>
  );
}

export default InicioS;