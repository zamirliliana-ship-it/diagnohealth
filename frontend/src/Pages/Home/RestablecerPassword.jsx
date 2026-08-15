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

function RestablecerPassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [verificando, setVerificando] = useState(true);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let mounted = true;

    const verificarRecuperacion = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        /*
         * Cuando Supabase devuelve al usuario desde
         * el enlace de recuperación, debe existir una sesión.
         */

        if (!session) {
          setError(
            "El enlace de recuperación no es válido o ha expirado."
          );
        }
      } catch (error) {
        console.error(
          "Error verificando recuperación:",
          error
        );

        if (mounted) {
          setError(
            "No fue posible verificar el enlace de recuperación."
          );
        }
      } finally {
        if (mounted) {
          setVerificando(false);
        }
      }
    };

    /*
     * Escuchamos PASSWORD_RECOVERY porque Supabase
     * utiliza este evento durante el flujo de recuperación.
     */

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event) => {
        if (
          event === "PASSWORD_RECOVERY" &&
          mounted
        ) {
          setError("");
          setVerificando(false);
        }
      }
    );

    verificarRecuperacion();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        throw error;
      }

      setSuccess(
        "Tu contraseña fue actualizada correctamente."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(async () => {
        await supabase.auth.signOut();

        navigate("/inicioS", {
          replace: true,
        });
      }, 2000);

    } catch (error) {
      console.error(
        "Error actualizando contraseña:",
        error
      );

      setError(
        error.message ||
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

        {/* ICONO */}

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0F2FE]">

          <Lock
            size={30}
            className="text-[#0369A1]"
          />

        </div>

        {/* TÍTULO */}

        <h1 className="text-center text-2xl font-bold text-[#00334F]">
          Nueva contraseña
        </h1>

        <p className="mt-2 text-center text-sm leading-6 text-gray-500">
          Crea una nueva contraseña para volver a
          acceder a tu cuenta de DiagnoHealth.
        </p>

        {/* ERROR */}

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

        {/* ÉXITO */}

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

        {!success && !error && (
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {/* NUEVA CONTRASEÑA */}

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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                    setShowPassword(
                      (value) => !value
                    )
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

            {/* CONFIRMAR */}

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
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-11 text-sm outline-none focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value
                    )
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

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#67A8CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4F96C0] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Lock size={18} />

              {loading
                ? "Actualizando..."
                : "Cambiar contraseña"}
            </button>

          </form>
        )}

        {error && (
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