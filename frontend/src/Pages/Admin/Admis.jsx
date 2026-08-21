import React, { useState, useEffect } from "react";
import { supabase } from "../../config/supabase";

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
const DiagnoHealthApp = () => {
  const [activeTab, setActiveTab] = useState("panel");

  const renderContent = () => {
    switch (activeTab) {
      case "panel":
        return <DashboardView />;
      case "estadisticas":
        return <StatisticsView />;
      case "pacientes":
        return <PatientsView />;
      case "fuentes":
        return <SourcesView />;
      case "recursos":
        return <ResourcesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64">{renderContent()}</div>
    </div>
  );
};

// ==========================================
// MENU LATERAL (SIDEBAR)
// ==========================================
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "panel", icon: "dashboard", label: "Panel" },
    { id: "estadisticas", icon: "bar_chart", label: "Estadísticas" },
    { id: "pacientes", icon: "groups", label: "Pacientes" },
    { id: "fuentes", icon: "database", label: "Fuentes" },
    { id: "recursos", icon: "library_books", label: "Recursos" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sky-900 text-white flex flex-col z-40 shadow-lg">
      <div className="p-6 flex items-center gap-3 border-b border-sky-800">
        <div className="w-10 h-10 rounded-lg bg-sky-700 flex items-center justify-center">
          <span className="material-symbols-outlined text-white">
            medical_services
          </span>
        </div>
        <div>
          <h1 className="text-[18px] font-bold leading-tight">DIAGNOHEALTH</h1>
          <p className="text-[10px] text-sky-300 uppercase tracking-widest mt-1">
            Admin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
              activeTab === item.id
                ? "bg-sky-800 text-white font-semibold border-l-4 border-sky-400"
                : "text-sky-200 hover:text-white hover:bg-sky-800/50"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

// ==========================================
// VISTA 1: PANEL
// ==========================================
const DashboardView = () => {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin");
        const data = await res.json();
        if (data.success) setTotalUsers(data.data.length);
      } catch (err) {
        console.error("Error al obtener usuarios:", err);
      }
    };
    fetchUsersCount();

    const channel = supabase
      .channel("realtime-users-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user" },
        () => {
          setTotalUsers((prev) => prev + 1);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "user" },
        () => {
          setTotalUsers((prev) => Math.max(0, prev - 1));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col pb-12">
      <header className="h-16 flex justify-between items-center px-8 z-30 bg-white/80 backdrop-blur-md border-b sticky top-0">
        <h2 className="text-xl font-bold text-sky-900">Panel administrativo</h2>
        <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Conectado en Tiempo Real
        </span>
      </header>

      <div className="p-8 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Usuarios Registrados</p>
              <h3 className="text-2xl font-bold text-sky-900">{totalUsers}</h3>
            </div>
            <div className="p-3 bg-sky-100 rounded-lg text-sky-700">
              <span className="material-symbols-outlined">person</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

// ==========================================
// VISTA 2: ESTADÍSTICAS
// ==========================================
const StatisticsView = () => (
  <main className="min-h-screen p-8">
    <h2 className="text-2xl font-bold text-sky-900 mb-4">
      Estadísticas generales
    </h2>
    <div className="bg-white border rounded-xl p-6 shadow-sm">
      <p className="text-gray-500 text-sm">
        Métricas analíticas basadas en actividad real.
      </p>
    </div>
  </main>
);

// ==========================================
// VISTA 3: PACIENTES (Conectado a la BD)
// ==========================================
const PatientsView = () => {
  const [patients, setPatients] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin");
        const data = await res.json();
        if (data.success) setPatients(data.data);
      } catch (err) {
        console.error("Error al cargar pacientes:", err);
      }
    };

    fetchPatients();

    const channel = supabase
      .channel("realtime-patients-table")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user" },
        (payload) => {
          setPatients((prev) => [payload.new, ...prev]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "user" },
        (payload) => {
          setPatients((prev) =>
            prev.filter((p) => (p.id || p.id_user) !== payload.old.id_user),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este usuario de la base de datos?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPatients(patients.filter((p) => (p.id || p.id_user) !== id));
      }
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const filteredPatients = patients.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.email && p.email.toLowerCase().includes(busqueda.toLowerCase())),
  );

  return (
    <main className="min-h-screen">
      <header className="h-16 flex justify-between items-center px-8 z-30 bg-white/90 backdrop-blur border-b sticky top-0">
        <h2 className="text-xl font-bold text-sky-900">
          Directorio de pacientes / usuarios
        </h2>
        <div className="relative w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="w-full bg-gray-50 border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-sky-500"
            placeholder="Buscar por nombre o correo..."
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </header>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b text-gray-600 text-xs uppercase">
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Correo</th>
                <th className="px-6 py-4">Teléfono</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p, i) => (
                  <tr
                    key={p.id || p.id_user || i}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {p.name || "Sin nombre"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.email}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {p.phone || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id || p.id_user)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer p-1"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

// ==========================================
// VISTA 4: FUENTES (Conectado a la BD Supabase)
// ==========================================
const SourcesView = () => {
  const [sources, setSources] = useState([]);
  const [newSourceName, setNewSourceName] = useState("");

  // Cargar fuentes reales desde Supabase
  const fetchSources = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/sources"); // <-- Añade /admin/
      const result = await res.json();
      if (result.success) setSources(result.data);
    } catch (err) {
      console.error("Error al cargar fuentes:", err);
    }
  };

  useEffect(() => {
    fetchSources();

    const channel = supabase
      .channel("realtime-sources")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sources" },
        () => {
          fetchSources();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddSource = async (e) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/sources", {
        // <-- Añade /admin/
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSourceName }),
      });
      const result = await res.json();

      if (result.success) {
        setNewSourceName("");
        fetchSources();
      }
    } catch (err) {
      console.error("Error al enviar la fuente:", err);
    }
  };

  const handleDeleteSource = async (id) => {
    if (!confirm("¿Deseas eliminar esta fuente?")) return;
    const { error } = await supabase.from("sources").delete().eq("id", id);
    if (!error) fetchSources();
  };

  return (
    <main className="min-h-screen pb-12">
      <header className="h-16 flex justify-between items-center px-8 z-30 bg-white/90 backdrop-blur border-b sticky top-0">
        <h2 className="text-xl font-bold text-sky-900">
          Gestión de fuentes de conocimiento
        </h2>
      </header>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <form
          onSubmit={handleAddSource}
          className="border-2 border-dashed border-gray-300 p-8 bg-white flex flex-col items-center justify-center rounded-xl shadow-sm"
        >
          <span className="material-symbols-outlined text-[40px] text-sky-600 mb-2">
            upload_file
          </span>
          <h3 className="text-lg font-bold text-gray-800">
            Agregar nueva guía clínica o documento
          </h3>
          <div className="flex w-full max-w-md gap-2 mt-4">
            <input
              type="text"
              placeholder="Ej: Protocolo_Ansiedad.pdf"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              className="flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              Subir
            </button>
          </div>
        </form>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b bg-gray-50 font-bold text-sky-900">
            Fuentes Registradas ({sources.length})
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-gray-600 text-xs uppercase bg-gray-50/50">
                <th className="px-6 py-4">Nombre del Documento</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {sources.length > 0 ? (
                sources.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {doc.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteSource(doc.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No hay fuentes registradas en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

// ==========================================
// VISTA 5: RECURSOS (Conectado a la BD Supabase)
// ==========================================
const ResourcesView = () => {
  const [resources, setResources] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("Relajación");

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("id", { ascending: false });
    if (!error && data) setResources(data);
  };

  useEffect(() => {
    fetchResources();

    const channel = supabase
      .channel("realtime-resources")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        () => {
          fetchResources();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAddResource = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const iconName =
      newCat === "Relajación"
        ? "air"
        : newCat === "Hábitos"
          ? "bedtime"
          : "psychology";

    const { error } = await supabase
      .from("resources")
      .insert([{ title: newTitle, cat: newCat, icon: iconName }]);
    if (!error) {
      setNewTitle("");
      fetchResources();
    } else {
      alert("Error al guardar el recurso en la base de datos");
    }
  };

  const handleDeleteResource = async (id) => {
    if (!confirm("¿Deseas eliminar este recurso?")) return;
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (!error) fetchResources();
  };

  return (
    <main className="min-h-screen pb-12">
      <header className="h-16 flex justify-between items-center px-8 z-30 bg-white/90 backdrop-blur border-b sticky top-0">
        <h2 className="text-xl font-bold text-sky-900">
          Gestión de recursos terapéuticos
        </h2>
      </header>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <div className="p-8 rounded-xl bg-gradient-to-r from-sky-900 to-sky-700 text-white shadow-sm">
          <h3 className="font-headline-lg text-2xl font-bold">
            Biblioteca de Bienestar
          </h3>
          <p className="text-sky-100 text-sm mt-1">
            Gestiona herramientas terapéuticas conectadas directamente al
            sistema.
          </p>
        </div>

        <form
          onSubmit={handleAddResource}
          className="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-4 items-end"
        >
          <div className="flex-1 w-full">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Título del Recurso
            </label>
            <input
              type="text"
              placeholder="Ej: Técnicas de manejo de estrés"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-sky-500"
            />
          </div>
          <div className="w-full md:w-52">
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
              Categoría
            </label>
            <select
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              className="w-full bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-sky-500 cursor-pointer"
            >
              <option value="Relajación">Relajación</option>
              <option value="Hábitos">Hábitos</option>
              <option value="Terapia Cognitiva">Terapia Cognitiva</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            + Nuevo recurso
          </button>
        </form>

        <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50 text-gray-600 text-xs uppercase">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Categoría</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {resources.length > 0 ? (
                resources.map((res) => (
                  <tr
                    key={res.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <span className="material-symbols-outlined p-2 bg-sky-100 text-sky-700 rounded-lg">
                        {res.icon || "star"}
                      </span>
                      <span className="font-bold text-gray-800">
                        {res.title}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-sky-50 text-sky-800 px-3 py-1 rounded-full text-xs font-semibold border border-sky-200">
                        {res.cat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    No hay recursos registrados en la base de datos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default DiagnoHealthApp;
