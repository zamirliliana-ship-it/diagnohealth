import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

export default function Perfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    genero: "",
  });

  // ==========================================
  // CARGAR DATOS DEL USUARIO
  // ==========================================

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error cargando perfil:", error);
        setMensaje("No fue posible cargar tu perfil.");
        return;
      }

      setUsuario(data);

      setFormulario({
        nombres: data.nombres || "",
        apellidos: data.apellidos || "",
        telefono: data.telefono || "",
        genero: data.genero || "",
      });

    } catch (error) {
      console.error("Error:", error);
      setMensaje("Ocurrió un error inesperado.");
    } finally {
      setCargando(false);
    }
  };

  // ==========================================
  // CAMBIAR CAMPOS
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // GUARDAR CAMBIOS
  // ==========================================

  const guardarCambios = async () => {
    try {
      setGuardando(true);
      setMensaje("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("usuarios")
        .update({
          nombres: formulario.nombres.trim(),
          apellidos: formulario.apellidos.trim(),
          telefono: formulario.telefono.trim(),
          genero: formulario.genero,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) {
        console.error("Error actualizando perfil:", error);
        setMensaje("❌ No fue posible guardar los cambios.");
        return;
      }

      setUsuario(data);
      setEditando(false);

      setMensaje("✅ Perfil actualizado correctamente.");

    } catch (error) {
      console.error("Error:", error);
      setMensaje("❌ Ocurrió un error inesperado.");
    } finally {
      setGuardando(false);
    }
  };

  // ==========================================
  // CANCELAR EDICIÓN
  // ==========================================

  const cancelarEdicion = () => {
    if (usuario) {
      setFormulario({
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        telefono: usuario.telefono || "",
        genero: usuario.genero || "",
      });
    }

    setEditando(false);
    setMensaje("");
  };

  // ==========================================
  // CARGANDO
  // ==========================================

  if (cargando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0369A1]/20 border-t-[#0369A1]" />

          <p className="text-gray-600">
            Cargando perfil...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8">

      <div className="mx-auto max-w-3xl">

        {/* ENCABEZADO */}

        <div className="mb-6 flex items-center justify-between">

          <button
            onClick={() => navigate("/panel")}
            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-100"
          >
            ← Volver
          </button>

          <h1 className="text-2xl font-bold text-[#0369A1]">
            Mi Perfil
          </h1>

          <div className="w-20" />

        </div>

        {/* TARJETA */}

        <div className="rounded-2xl bg-white p-6 shadow-lg">

          {/* AVATAR */}

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#0369A1] text-4xl font-bold text-white">

              {usuario?.nombres
                ? usuario.nombres.charAt(0).toUpperCase()
                : "U"}

            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">

              {usuario?.nombres} {usuario?.apellidos}

            </h2>

            <p className="text-gray-500">
              {usuario?.correo}
            </p>

          </div>

          {/* MENSAJE */}

          {mensaje && (
            <div className="mb-5 rounded-lg bg-gray-100 p-3 text-center text-sm">
              {mensaje}
            </div>
          )}

          {/* FORMULARIO */}

          <div className="grid gap-5 md:grid-cols-2">

            {/* NOMBRES */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Nombres
              </label>

              <input
                type="text"
                name="nombres"
                value={formulario.nombres}
                onChange={handleChange}
                disabled={!editando}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"
              />

            </div>

            {/* APELLIDOS */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Apellidos
              </label>

              <input
                type="text"
                name="apellidos"
                value={formulario.apellidos}
                onChange={handleChange}
                disabled={!editando}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"
              />

            </div>

            {/* CORREO */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>

              <input
                type="email"
                value={usuario?.correo || ""}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
              />

            </div>

            {/* TELÉFONO */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Teléfono
              </label>

              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={handleChange}
                disabled={!editando}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"
              />

            </div>

            {/* GÉNERO */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Género
              </label>

              <select
                name="genero"
                value={formulario.genero}
                onChange={handleChange}
                disabled={!editando}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 disabled:bg-gray-100"
              >
                <option value="">
                  Selecciona una opción
                </option>

                <option value="Masculino">
                  Masculino
                </option>

                <option value="Femenino">
                  Femenino
                </option>

                <option value="Otro">
                  Otro
                </option>

                <option value="Prefiero no decirlo">
                  Prefiero no decirlo
                </option>

              </select>

            </div>

            {/* DOCUMENTO */}

            <div>

              <label className="mb-1 block text-sm font-medium text-gray-700">
                Documento
              </label>

              <input
                type="text"
                value={`${usuario?.tipo_documento || ""} ${usuario?.numero_documento || ""}`}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-3"
              />

            </div>

          </div>

          {/* BOTONES */}

          <div className="mt-8 flex flex-wrap justify-center gap-4">

            {!editando ? (

              <button
                onClick={() => {
                  setEditando(true);
                  setMensaje("");
                }}
                className="rounded-lg bg-[#0369A1] px-6 py-3 font-medium text-white hover:bg-[#025a87]"
              >
                ✏️ Editar perfil
              </button>

            ) : (

              <>
                <button
                  onClick={guardarCambios}
                  disabled={guardando}
                  className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : "💾 Guardar cambios"}
                </button>

                <button
                  onClick={cancelarEdicion}
                  disabled={guardando}
                  className="rounded-lg bg-gray-500 px-6 py-3 font-medium text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}