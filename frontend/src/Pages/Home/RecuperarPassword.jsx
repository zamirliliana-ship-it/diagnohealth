import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { supabase } from "../../config/supabase";

function RecuperarPassword() {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMensaje("");
    setError("");

    const email = correo.trim();

    if (!email) {
      setError("Ingresa tu correo electrónico.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/restablecer-password`,
        }
      );

      if (error) {
        throw error;
      }

      setEnviado(true);

      setMensaje(
        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."
      );

    } catch (error) {
      console.error(
        "Error solicitando recuperación:",
        error
      );

      setError(
        error.message ||
          "No fue posible enviar el correo de recuperación."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-10">

      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">

        <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          {/* VOLVER */}

          <button
            type="button"
            onClick={() => navigate("/inicioS")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#0369A1] hover:text-[#0C4A6E]"
          >
            <ArrowLeft size={18} />
            Volver al inicio de sesión
          </button>

          {/* ICONO */}

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0F2FE]">
            {enviado ? (
              <CheckCircle
                size={30}
                className="text-green-600"
              />
            ) : (
              <Mail
                size={30}
                className="text-[#0369A1]"
              />
            )}
          </div>

          {/* TÍTULO */}

          <h1 className="text-center text-2xl font-bold text-[#00334F]">
            {enviado
              ? "Revisa tu correo"
              : "Recuperar contraseña"}
          </h1>

          <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-gray-500">
            {enviado
              ? "Te hemos enviado instrucciones para recuperar el acceso a tu cuenta."
              : "Ingresa el correo electrónico asociado a tu cuenta de DiagnoHealth."}
          </p>

          {/* MENSAJE DE ÉXITO */}

          {mensaje && (
            <div
              role="status"
              className="mt-6 flex gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              <CheckCircle
                size={20}
                className="mt-0.5 shrink-0"
              />

              <p>{mensaje}</p>
            </div>
          )}

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

          {!enviado ? (
            <form
              onSubmit={handleSubmit}
              className="mt-7"
            >

              {/* CORREO */}

              <label
                htmlFor="correo"
                className="mb-2 block text-sm font-medium text-[#00334F]"
              >
                Correo electrónico
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

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
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#0369A1] focus:ring-2 focus:ring-[#0369A1]/20 disabled:bg-gray-100"
                />

              </div>

              {/* BOTÓN */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#67A8CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4F96C0] disabled:cursor-not-allowed disabled:opacity-60"
              >

                <Send size={18} />

                {loading
                  ? "Enviando..."
                  : "Enviar enlace de recuperación"}

              </button>

            </form>
          ) : (
            <div className="mt-7 space-y-3">

              <button
                type="button"
                onClick={() => {
                  setEnviado(false);
                  setMensaje("");
                  setCorreo("");
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Usar otro correo
              </button>

              <Link
                to="/inicioS"
                className="flex w-full items-center justify-center rounded-lg bg-[#67A8CE] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#4F96C0]"
              >
                Volver a iniciar sesión
              </Link>

            </div>
          )}

          {/* INFORMACIÓN */}

          <div className="mt-7 border-t border-gray-200 pt-5">

            <p className="text-center text-xs leading-5 text-gray-500">
              Por seguridad, si el correo no está registrado,
              no se revelará información sobre la existencia
              de la cuenta.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RecuperarPassword;