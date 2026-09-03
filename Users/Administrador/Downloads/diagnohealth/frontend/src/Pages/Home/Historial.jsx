import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

export default function Historial() {
  const navigate = useNavigate();

  const [conversaciones, setConversaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [eliminando, setEliminando] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // ==========================================================
  // CARGAR CONVERSACIONES DEL USUARIO
  // ==========================================================

  useEffect(() => {
    cargarConversaciones();
  }, []);

  const cargarConversaciones = async () => {
    try {
      setCargando(true);
      setMensaje("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("conversaciones")
        .select("*")
        .eq("usuario_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error cargando conversaciones:", error);
        setMensaje("❌ No fue posible cargar el historial.");
        return;
      }

      setConversaciones(data || []);

    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Ocurrió un error inesperado.");
    } finally {
      setCargando(false);
    }
  };

  // ==========================================================
  // ELIMINAR CONVERSACIÓN
  // ==========================================================

  const eliminarConversacion = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar esta conversación?"
    );

    if (!confirmar) return;

    try {
      setEliminando(id);

      const { error } = await supabase
        .from("conversaciones")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error eliminando conversación:", error);
        setMensaje("❌ No fue posible eliminar la conversación.");
        return;
      }

      setConversaciones((prev) =>
        prev.filter((conversacion) => conversacion.id !== id)
      );

      setMensaje("✅ Conversación eliminada correctamente.");

    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Ocurrió un error al eliminar.");
    } finally {
      setEliminando(null);
    }
  };

  // ==========================================================
  // ABRIR CONVERSACIÓN
  // ==========================================================

  const abrirConversacion = (id) => {
    navigate(`/chatbot?conversacion=${id}`);
  };

  // ==========================================================
  // NUEVA CONVERSACIÓN
  // ==========================================================

  const nuevaConversacion = () => {
    navigate("/chatbot");
  };

  // ==========================================================
  // FORMATEAR FECHA
  // ==========================================================

  const formatearFecha = (fecha) => {
    if (!fecha) return "";

    return new Date(fecha).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // ==========================================================
  // CARGANDO
  // ==========================================================

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0369A1]/20 border-t-[#0369A1]" />

          <p className="text-gray-600">
            Cargando historial...
          </p>

        </div>
      </div>
    );
  }

  // ==========================================================
  // INTERFAZ
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">

      <div className="mx-auto max-w-4xl">

        {/* ENCABEZADO */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <button
              onClick={() => navigate("/panel")}
              className="mb-3 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
            >
              ← Volver al panel
            </button>

            <h1 className="text-3xl font-bold text-[#0369A1]">
              Historial de YAIRA
            </h1>

            <p className="mt-1 text-gray-600">
              Consulta tus conversaciones anteriores.
            </p>
          </div>

          <button
            onClick={nuevaConversacion}
            className="rounded-xl bg-[#0369A1] px-5 py-3 font-medium text-white shadow hover:bg-[#025a87]"
          >
            + Nueva conversación
          </button>

        </div>

        {/* MENSAJE */}

        {mensaje && (
          <div className="mb-5 rounded-lg bg-white p-4 text-center shadow">
            {mensaje}
          </div>
        )}

        {/* SIN CONVERSACIONES */}

        {conversaciones.length === 0 ? (

          <div className="rounded-2xl bg-white p-10 text-center shadow">

            <div className="mb-4 text-5xl">
              💬
            </div>

            <h2 className="text-xl font-bold text-gray-800">
              Aún no tienes conversaciones
            </h2>

            <p className="mt-2 text-gray-600">
              Comienza una conversación con YAIRA y aparecerá aquí.
            </p>

            <button
              onClick={nuevaConversacion}
              className="mt-6 rounded-xl bg-[#0369A1] px-6 py-3 font-medium text-white hover:bg-[#025a87]"
            >
              Hablar con YAIRA
            </button>

          </div>

        ) : (

          <div className="space-y-4">

            {conversaciones.map((conversacion) => (

              <div
                key={conversacion.id}
                className="rounded-2xl bg-white p-5 shadow transition hover:shadow-md"
              >

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <button
                    onClick={() =>
                      abrirConversacion(conversacion.id)
                    }
                    className="flex-1 text-left"
                  >

                    <h2 className="text-lg font-bold text-gray-800">
                      💬 {conversacion.titulo || "Nueva conversación"}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Última actualización:{" "}
                      {formatearFecha(
                        conversacion.updated_at ||
                        conversacion.created_at
                      )}
                    </p>

                  </button>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        abrirConversacion(conversacion.id)
                      }
                      className="rounded-lg bg-[#0369A1] px-4 py-2 text-sm font-medium text-white hover:bg-[#025a87]"
                    >
                      Abrir
                    </button>

                    <button
                      onClick={() =>
                        eliminarConversacion(conversacion.id)
                      }
                      disabled={eliminando === conversacion.id}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {eliminando === conversacion.id
                        ? "Eliminando..."
                        : "Eliminar"}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}