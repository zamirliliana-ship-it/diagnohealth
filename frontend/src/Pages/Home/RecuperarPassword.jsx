import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const getRedirectUrl = () => {
    return `${window.location.origin}/restablecer-password`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    const correo = email.trim().toLowerCase();

    if (!correo) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = getRedirectUrl();

      const respuesta = await fetch(
        `${API_URL}/api/auth/recuperar-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            correo,
            redirectTo: redirectUrl,
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
        const mensajeError =
          (data.message || "").toLowerCase();

        if (
          respuesta.status === 429 ||
          mensajeError.includes("espera unos minutos")
        ) {
          setError(
            "Has solicitado varios enlaces recientemente. Por favor, espera unos minutos antes de intentarlo nuevamente."
          );
          return;
        }

        setError(
          data.message ||
            "No fue posible procesar la solicitud."
        );
        return;
      }

      setMensaje(
        data.message ||
          "Si existe una cuenta asociada a este correo, recibirás un enlace para restablecer tu contraseña. Revisa también la carpeta de spam."
      );

      setEmail("");
    } catch (err) {
      console.error(
        "Error inesperado en recuperación:",
        err
      );

      setError(
        "Ocurrió un error inesperado. Por favor, inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f6f1] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-8">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-3xl">✉️</span>
          </div>
        </div>

        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-[#003b5c]">
            Recuperar contraseña
          </h1>

          <p className="text-gray-500 mt-2">
            Ingresa tu correo electrónico y te enviaremos un enlace para
            restablecer tu contraseña.
          </p>
        </div>

        {mensaje && (
          <div className="mb-5 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
            {mensaje}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#003b5c] mb-2"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              autoComplete="email"
              disabled={loading}
              className="w-full h-12 rounded-lg border border-gray-300 px-4 outline-none transition focus:border-[#69a9cc] focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-lg bg-[#69a9cc] text-white font-semibold transition hover:bg-[#5799bf] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading
              ? "Enviando..."
              : "Enviar enlace de recuperación"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-[#006da4] hover:underline"
          >
            ← Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
