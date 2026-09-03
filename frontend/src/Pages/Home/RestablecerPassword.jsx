import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../../config/supabase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

function RestablecerPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(true);
  const [enlaceValido, setEnlaceValido] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;
    let listo = false;

    const finalizar = ({ valido, mensajeError = "" }) => {
      if (!mounted || listo) return;

      listo = true;
      setEnlaceValido(valido);
      setError(mensajeError);
      setVerificando(false);
    };

    const obtenerErrorDeUrl = () => {
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );
      const queryParams = new URLSearchParams(
        window.location.search
      );

      return (
        hashParams.get("error_description") ||
        queryParams.get("error_description") ||
        hashParams.get("error") ||
        queryParams.get("error")
      );
    };

    const verificarRecuperacion = async () => {
      try {
        const errorUrl = obtenerErrorDeUrl();

        if (errorUrl) {
          finalizar({
            valido: false,
            mensajeError:
              "El enlace de recuperación no es válido o ha expirado.",
          });
          return;
        }

        const hashParams = new URLSearchParams(
          window.location.hash.replace(/^#/, "")
        );
        const queryParams = new URLSearchParams(
          window.location.search
        );
        const code = queryParams.get("code");
        const esEnlaceRecuperacion =
          Boolean(code) ||
          hashParams.get("type") === "recovery" ||
          Boolean(hashParams.get("access_token"));

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (!mounted) return;

          if (exchangeError) {
            finalizar({
              valido: false,
              mensajeError:
                "El enlace de recuperación no es válido o ha expirado.",
            });
            return;
          }

          window.history.replaceState(
            {},
            document.title,
            "/restablecer-password"
          );

          finalizar({ valido: true });
          return;
        }

        if (!esEnlaceRecuperacion) {
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          finalizar({ valido: true });
        }
      } catch (errorVerificacion) {
        console.error(
          "Error verificando recuperación:",
          errorVerificacion
        );

        finalizar({
          valido: false,
          mensajeError:
            "No fue posible verificar el enlace de recuperación.",
        });
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (!mounted) return;

      if (event === "PASSWORD_RECOVERY") {
        finalizar({ valido: true });
      }
    });

    verificarRecuperacion();

    const timeout = setTimeout(async () => {
      if (!mounted || listo) return;

      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );
      const queryParams = new URLSearchParams(
        window.location.search
      );
      const tuvoEnlace =
        Boolean(queryParams.get("code")) ||
        hashParams.get("type") === "recovery" ||
        Boolean(hashParams.get("access_token"));

      if (tuvoEnlace) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          finalizar({ valido: true });
          return;
        }
      }

      finalizar({
        valido: false,
        mensajeError:
          "El enlace de recuperación no es válido o ha expirado.",
      });
    }, 2500);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setEnlaceValido(false);
        setError(
          "El enlace de recuperación no es válido o ha expirado."
        );
        return;
      }

      const respuesta = await fetch(
        `${API_URL}/api/auth/restablecer-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            password,
            confirmPassword,
          }),
        }
      );

      let data = {};

      try {
        data = await respuesta.json();
      } catch {
        data = {};
      }

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          setEnlaceValido(false);
        }

        throw new Error(
          data.message ||
            "No fue posible actualizar la contraseña."
        );
      }

      setSuccess(
        data.message ||
          "Tu contraseña fue actualizada correctamente."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
      }, 2000);
    } catch (errorActualizacion) {
      console.error(
        "Error actualizando contraseña:",
        errorActualizacion
      );

      setError(
        errorActualizacion.message ||
          "No fue posible actualizar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0369A1]/20 border-t-[#0369A1]" />

          <p className="text-sm text-gray-500">
            Verificando enlace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0F2FE]">
          <Lock size={30} className="text-[#0369A1]" />
        </div>

        <h1 className="text-center text-2xl font-bold text-[#00334F]">
          Nueva contraseña
        </h1>

        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
          Crea una nueva contraseña para volver a acceder a tu cuenta
          de DiagnoHealth.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle
              size={20}
              className="mt-0.5 shrink-0"
            />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div
            role="status"
            className="mt-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <CheckCircle
              size={20}
              className="mt-0.5 shrink-0"
            />
            <p>{success}</p>
          </div>
        )}

        {!success && enlaceValido && (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#00334F]"
              >
                Nueva contraseña
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Ingresa tu nueva contraseña"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-[#00334F]"
              >
                Confirmar contraseña
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={
                    showConfirmPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#67A8CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4F96C0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={18} />
              {loading ? "Actualizando..." : "Cambiar contraseña"}
            </button>
          </form>
        )}

        {!enlaceValido && (
          <button
            type="button"
            onClick={() => navigate("/recuperar-password")}
            className="mt-5 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Solicitar otro enlace
          </button>
        )}
      </div>
    </div>
  );
}

export default RestablecerPassword;
