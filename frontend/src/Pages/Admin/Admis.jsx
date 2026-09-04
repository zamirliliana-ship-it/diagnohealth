import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";

const AuthPortal = () => {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  // Estados para el Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para el Registro
  const [fullName, setFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [role, setRole] = useState("");

  const toggleView = () => {
    setIsRegister(!isRegister);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        alert("Error al iniciar sesión: " + error.message);
        return;
      }

      if (data && data.session) {
        window.location.href = "/admin/admis";
      }
    } catch (err) {
      console.error("Error inesperado en login:", err);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: regEmail,
        password: regPassword,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        alert("Error al registrar administrador: " + error.message);
        return;
      }

      alert("¡Administrador registrado con éxito! Ya puedes iniciar sesión.");
      setIsRegister(false);
    } catch (err) {
      console.error("Error inesperado en registro:", err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center font-sans text-slate-800 antialiased">
      <div className="w-full max-w-6xl mx-auto min-h-[650px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 m-4">
        <div className="lg:col-span-5 relative bg-sky-950 text-white flex flex-col justify-between p-10 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
              alt="Médico analizando datos"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/70 to-transparent"></div>
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600 flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white">
                medical_services
              </span>
            </div>
            <span className="font-bold tracking-wider text-lg">
              DIAGNOHEALTH
            </span>
          </div>

          <div className="relative z-10 my-auto py-12">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">
              Gestión médica inteligente y segura.
            </h2>
            <p className="text-sky-200 text-sm leading-relaxed">
              Plataforma centralizada de administración clínica, control de
              pacientes y analíticas en tiempo real para optimizar la atención
              de la salud mental.
            </p>
          </div>

          <div className="relative z-10 text-xs text-sky-400">
            &copy; 2026 DiagnoHealth Systems. Todos los derechos reservados.
          </div>
        </div>

        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto max-h-[85vh]">
          {!isRegister ? (
            <div className="w-full max-w-md mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Iniciar Sesión
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Ingresa tus credenciales para acceder al panel de
                  administración.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                    htmlFor="login-email"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        mail
                      </span>
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
                      id="login-email"
                      name="email"
                      placeholder="admin@diagnohealth.com"
                      required
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                    htmlFor="login-password"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        lock
                      </span>
                    </div>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white transition-all"
                      id="login-password"
                      name="password"
                      placeholder="••••••••"
                      required
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="w-full py-2.5 bg-sky-900 hover:bg-sky-950 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex justify-center items-center gap-2 cursor-pointer mt-2"
                  type="submit"
                >
                  <span>Iniciar Sesión</span>
                  <span className="material-symbols-outlined text-sm">
                    login
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  ¿No tienes cuenta de administrador?{" "}
                  <button
                    onClick={toggleView}
                    className="text-sky-700 font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Regístrate aquí
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="w-full max-w-lg mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Registro de Administrador
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Completa los datos para dar de alta un nuevo perfil con
                  privilegios.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                      htmlFor="fullName"
                    >
                      Nombre completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                          person
                        </span>
                      </div>
                      <input
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white"
                        id="fullName"
                        name="fullName"
                        placeholder="Ej. Carlos Pérez"
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                      htmlFor="reg-email"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                          mail
                        </span>
                      </div>
                      <input
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white"
                        id="reg-email"
                        name="email"
                        placeholder="correo@ejemplo.com"
                        required
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                      htmlFor="reg-password"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                          lock
                        </span>
                      </div>
                      <input
                        className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white"
                        id="reg-password"
                        name="password"
                        placeholder="••••••••"
                        required
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                      htmlFor="role"
                    >
                      Rol asignado
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                          badge
                        </span>
                      </div>
                      <select
                        className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:bg-white appearance-none cursor-pointer"
                        id="role"
                        name="role"
                        required
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <option disabled value="">
                          Seleccionar Rol
                        </option>
                        <option value="super_admin">Super Admin</option>
                        <option value="gestor_contenido">
                          Gestor de Contenido
                        </option>
                        <option value="gestor_usuarios">
                          Gestor de Usuarios
                        </option>
                        <option value="analista">Analista</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-slate-400 text-sm">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1"
                    htmlFor="createdAt"
                  >
                    Fecha de creación
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-slate-400 text-sm">
                        calendar_today
                      </span>
                    </div>
                    <input
                      className="w-full pl-10 pr-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed"
                      id="createdAt"
                      name="createdAt"
                      readOnly
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full py-2.5 bg-sky-900 hover:bg-sky-950 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                    type="submit"
                  >
                    Registrar Administrador
                  </button>
                </div>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    onClick={toggleView}
                    className="text-sky-700 font-semibold hover:underline cursor-pointer ml-1"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL DE APLICACIÓN
// ==========================================
const DiagnoHealthApp = () => {
  const [activeTab, setActiveTab] = useState("panel");

  const renderContent = () => {
    switch (activeTab) {
      case "panel":
        return <DashboardView setActiveTab={setActiveTab} />;
      case "estadisticas":
        return <StatisticsView />;
      case "pacientes":
        return <PatientsView />;
      case "fuentes":
        return <SourcesView />;
      case "recursos":
        return <ResourcesView />;
      default:
        return <DashboardView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative font-sans flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {renderContent()}
      </div>
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("admin_logged");
    window.location.href = "/admin/login";
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sky-950 text-white flex flex-col z-40 shadow-lg">
      <div className="p-6 flex items-center gap-3 border-b border-sky-900">
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

      <nav className="flex-1 px-4 mt-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer text-sm font-medium ${
              activeTab === item.id
                ? "bg-sky-900 text-white border-l-4 border-sky-400"
                : "text-sky-300 hover:text-white hover:bg-sky-900/40"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sky-900 space-y-2">
        <button
          onClick={() => alert("Generando reporte general de actividad...")}
          className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            download
          </span>
          Generar Reporte
        </button>
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

// ==========================================
// VISTA 1: PANEL (Dashboard conectado a todas las tablas)
// ==========================================
const DashboardView = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    users: 0,
    chats: 0,
    crises: 0,
    tests: 0,
  });

  const [recentPatients, setRecentPatients] = useState([]);
  const [activeAlertsList, setActiveAlertsList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // 1. Contar Usuarios y obtener recientes
      const { count: userCount, data: usersData } = await supabase
        .from("usuarios")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // 2. Contar Sesiones de Chat (tabla: conversaciones)
      const { count: chatCount } = await supabase
        .from("conversaciones")
        .select("*", { count: "exact", head: true });

      // 3. Contar Alertas de crisis (tabla: alertas_crisis)
      const { count: crisisCount, data: crisisData } = await supabase
        .from("alertas_crisis")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      // 4. Contar Tests realizados (tabla: tests)
      const { count: testCount } = await supabase
        .from("tests")
        .select("*", { count: "exact", head: true });

      if (usersData) {
        setRecentPatients(usersData.slice(0, 5));
      }

      if (crisisData) {
        // Filtramos las que no han sido atendidas para mostrarlas en la lista (opcional)
        setActiveAlertsList(
          crisisData.filter((alerta) => !alerta.atendido).slice(0, 3),
        );
      }

      // Actualizar todos los estados
      setStats({
        users: userCount !== null ? userCount : usersData?.length || 0,
        chats: chatCount !== null ? chatCount : 0,
        crises: crisisCount !== null ? crisisCount : 0,
        tests: testCount !== null ? testCount : 0,
      });
    } catch (err) {
      console.error("Error cargando dashboard:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Suscribirse a cambios en TODAS las tablas relevantes para actualizar los contadores
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "usuarios" },
        fetchDashboardData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "conversaciones" },
        fetchDashboardData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alertas_crisis" },
        fetchDashboardData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tests" },
        fetchDashboardData,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <main className="flex-1 p-8 space-y-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-sky-950">Panel administrativo</h2>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistema en Línea
        </span>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Usuarios Registrados
            </p>
            <h3 className="text-3xl font-bold text-sky-950">{stats.users}</h3>
          </div>
          <div className="p-3 bg-sky-50 rounded-xl text-sky-600">
            <span className="material-symbols-outlined text-[28px]">
              person
            </span>
          </div>
        </div>
        <div className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Sesiones de chat
            </p>
            <h3 className="text-3xl font-bold text-sky-950">{stats.chats}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <span className="material-symbols-outlined text-[28px]">forum</span>
          </div>
        </div>
        <div className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-white text-[10px] font-bold rounded-bl-lg">
            CRÍTICO
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Alertas de crisis
            </p>
            <h3 className="text-3xl font-bold text-red-600">{stats.crises}</h3>
          </div>
          <div className="p-3 bg-red-50 rounded-xl text-red-600">
            <span className="material-symbols-outlined text-[28px]">
              notifications_active
            </span>
          </div>
        </div>
        <div className="bg-white border p-6 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              Tests realizados
            </p>
            <h3 className="text-3xl font-bold text-sky-950">{stats.tests}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <span className="material-symbols-outlined text-[28px]">
              assignment
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-bold text-gray-800">
              Uso del Chatbot (Últimos 7 días)
            </h4>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-lg">
              Semanal
            </span>
          </div>
          <div className="h-56 flex items-end justify-between gap-3 px-4 pt-4 border-b">
            {stats.users === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                Sin actividad registrada en la plataforma (0 registros).
              </div>
            ) : (
              [10, 20, 15, 30, 40, 25, 35].map((val, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center flex-1 h-full justify-end group"
                >
                  <div
                    className="w-full bg-sky-600 rounded-t-lg transition-all"
                    style={{ height: `${val}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"][idx]}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white border rounded-xl p-6 shadow-sm space-y-4">
          <h4 className="font-bold text-gray-800">Alertas Críticas</h4>
          {activeAlertsList.length === 0 ? (
            <div className="p-4 bg-gray-50 border rounded-lg text-center text-gray-400 text-sm py-10">
              No hay alertas activas en el sistema.
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlertsList.map((alerta) => (
                <div
                  key={alerta.id}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs"
                >
                  <p className="font-bold text-red-700 mb-1">
                    Alerta detectada
                  </p>
                  <p className="text-red-600 line-clamp-2">
                    {alerta.motivo ||
                      "Situación de riesgo detectada en el chat."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h4 className="font-bold text-sky-950">
            Pacientes recientes registrados
          </h4>
          <button
            onClick={() => setActiveTab("pacientes")}
            className="text-xs text-sky-600 hover:underline font-semibold cursor-pointer"
          >
            Ver todos
          </button>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-500 text-xs uppercase bg-gray-50/50">
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Correo</th>
              <th className="px-6 py-3">Teléfono</th>
              <th className="px-6 py-3 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {recentPatients.length > 0 ? (
              recentPatients.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-bold text-gray-800">
                    {p.nombres
                      ? `${p.nombres} ${p.apellidos || ""}`
                      : "Sin nombre"}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{p.correo}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {p.telefono || "N/A"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => alert(`Expediente de ${p.nombres}`)}
                      className="text-xs bg-sky-50 text-sky-700 px-3 py-1 rounded-lg border border-sky-200 cursor-pointer"
                    >
                      Expediente
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
                  La base de datos está vacía. No hay usuarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
};

// ==========================================
// VISTA 2: ESTADÍSTICAS (Conectada a 'usuarios')
// ==========================================
const StatisticsView = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSources, setTotalSources] = useState(0);
  const [totalResources, setTotalResources] = useState(0);
  const [filter, setFilter] = useState("7D");
  const [activeSubTab, setActiveSubTab] = useState("general");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealStats = async () => {
      setLoading(true);
      try {
        const { count: usersCount } = await supabase
          .from("usuarios")
          .select("*", { count: "exact", head: true });

        const { count: sourcesCount } = await supabase
          .from("sources")
          .select("*", { count: "exact", head: true });

        const { count: resourcesCount } = await supabase
          .from("resources")
          .select("*", { count: "exact", head: true });

        setTotalUsers(usersCount || 0);
        setTotalSources(sourcesCount || 0);
        setTotalResources(resourcesCount || 0);
      } catch (error) {
        console.error("Error al cargar estadísticas reales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRealStats();
  }, []);

  return (
    <main className="flex-1 p-8 space-y-6">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-sky-950">
            Estadísticas generales
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:ring-2 focus:ring-sky-500 text-sm w-64 outline-none"
              placeholder="Buscar métricas o reportes..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 border px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-50">
            <span className="material-symbols-outlined text-sm">
              calendar_today
            </span>
            <span>Datos en tiempo real</span>
          </div>
        </div>
      </header>

      <div className="flex border-b border-gray-200 gap-8 text-sm font-semibold">
        <button
          onClick={() => setActiveSubTab("general")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeSubTab === "general" ? "border-sky-600 text-sky-950" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Uso general
        </button>
        <button
          onClick={() => setActiveSubTab("segmentacion")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeSubTab === "segmentacion" ? "border-sky-600 text-sky-950" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Segmentación
        </button>
        <button
          onClick={() => setActiveSubTab("retencion")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeSubTab === "retencion" ? "border-sky-600 text-sky-950" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Retención
        </button>
        <button
          onClick={() => setActiveSubTab("abandono")}
          className={`pb-3 border-b-2 transition-all cursor-pointer ${activeSubTab === "abandono" ? "border-sky-600 text-sky-950" : "border-transparent text-gray-400 hover:text-gray-600"}`}
        >
          Abandono
        </button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex bg-white border rounded-lg p-1 shadow-sm text-xs">
          <button
            onClick={() => setFilter("7D")}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${filter === "7D" ? "bg-gray-100 text-sky-950" : "text-gray-500"}`}
          >
            7 Días
          </button>
          <button
            onClick={() => setFilter("30D")}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${filter === "30D" ? "bg-gray-100 text-sky-950" : "text-gray-500"}`}
          >
            30 Días
          </button>
          <button
            onClick={() => setFilter("Custom")}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${filter === "Custom" ? "bg-gray-100 text-sky-950" : "text-gray-500"}`}
          >
            Personalizado
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2D9CA] rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Total Usuarios Registrados
          </h3>
          <p className="text-3xl font-extrabold text-sky-950 mt-2">
            {loading ? "..." : totalUsers}
          </p>
          <span className="text-xs text-gray-400 mt-1 block">
            Tabla: public.usuarios
          </span>
        </div>

        <div className="bg-white border border-[#E2D9CA] rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Guías / Fuentes Subidas
          </h3>
          <p className="text-3xl font-extrabold text-sky-950 mt-2">
            {loading ? "..." : totalSources}
          </p>
          <span className="text-xs text-gray-400 mt-1 block">
            Tabla: public.sources
          </span>
        </div>

        <div className="bg-white border border-[#E2D9CA] rounded-xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Recursos Terapéuticos
          </h3>
          <p className="text-3xl font-extrabold text-sky-950 mt-2">
            {loading ? "..." : totalResources}
          </p>
          <span className="text-xs text-gray-400 mt-1 block">
            Tabla: public.resources
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-[#E2D9CA] rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Actividad Basada en Registros (Supabase)
              </h3>
              <div className="flex items-baseline gap-3 mt-1">
                <p className="text-3xl font-extrabold text-sky-950">
                  {totalUsers} Usuarios
                </p>
                <span className="text-xs text-sky-600 font-semibold">
                  Sincronizado
                </span>
              </div>
            </div>
          </div>

          <div className="h-48 w-full mt-6 flex items-center justify-center border-b pb-2 px-4">
            {totalUsers === 0 && totalSources === 0 ? (
              <div className="text-center text-gray-400 text-sm">
                Sin registros en la base de datos (0 en Supabase). Comienza
                agregando usuarios o archivos.
              </div>
            ) : (
              <div className="text-center text-sky-900 font-medium text-sm">
                Mostrando métricas reales de tus tablas conectadas en Supabase.
              </div>
            )}
          </div>
          <div className="flex justify-between text-[11px] text-gray-400 pt-2 px-2 uppercase">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
            <span>Dom</span>
          </div>
        </div>

        <div className="lg:col-span-4 bg-sky-950 text-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs uppercase tracking-wider text-sky-300 font-semibold">
              Estado del Sistema
            </h3>
            <p className="text-4xl font-extrabold mt-3">
              {totalUsers > 0 ? "Activo" : "Sin Datos"}
            </p>
            <p className="text-xs text-sky-300 mt-2">
              Base de datos en producción lista.
            </p>
          </div>
          <div className="space-y-2 mt-6">
            <div className="flex justify-between text-xs text-sky-200">
              <span>Registros Totales</span>
              <span className="text-emerald-400 font-bold">
                {totalUsers + totalSources + totalResources}
              </span>
            </div>
            <div className="h-2 w-full bg-sky-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full"
                style={{ width: totalUsers > 0 ? "100%" : "0%" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

// ==========================================
// VISTA 3: PACIENTES (Conectada a la tabla 'usuarios')
// ==========================================
const PatientsView = () => {
  const [patients, setPatients] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const fetchPatients = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPatients(data);
  };

  useEffect(() => {
    fetchPatients();
    const channel = supabase
      .channel("patients-dir")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "usuarios" },
        fetchPatients,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Deseas eliminar este usuario?")) return;
    await supabase.from("usuarios").delete().eq("id", id);
    fetchPatients();
  };

  const filtered = patients.filter((p) => {
    const fullName = `${p.nombres || ""} ${p.apellidos || ""}`.toLowerCase();
    const matchText =
      fullName.includes(busqueda.toLowerCase()) ||
      (p.correo && p.correo.toLowerCase().includes(busqueda.toLowerCase()));

    const matchEstado =
      filtroEstado === "Todos" || p.emotional_state === filtroEstado;

    return matchText && matchEstado;
  });

  const totalPacientes = patients.length;
  const estables = patients.filter(
    (p) => p.emotional_state === "Estable",
  ).length;
  const moderados = patients.filter(
    (p) => p.emotional_state === "Moderado",
  ).length;
  const altoRiesgo = patients.filter(
    (p) => p.emotional_state === "Alto Riesgo",
  ).length;

  return (
    <main className="flex-1 p-8 space-y-6 bg-slate-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border shadow-sm gap-4">
        <h2 className="text-xl font-bold text-sky-950">
          Directorio de pacientes
        </h2>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-sm">
              search
            </span>
            <input
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:border-sky-500"
              placeholder="Buscar por nombre o correo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 border px-3 py-2 rounded-lg text-sm text-gray-600">
            <span className="material-symbols-outlined text-sm">
              filter_list
            </span>
            <span className="text-xs font-semibold">Estado emocional:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-medium text-sky-950"
            >
              <option value="Todos">Todos</option>
              <option value="Estable">Estable</option>
              <option value="Moderado">Moderado</option>
              <option value="Alto Riesgo">Alto Riesgo</option>
            </select>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            TOTAL PACIENTES
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-sky-950">
              {totalPacientes}
            </h3>
            {totalPacientes > 0 && (
              <span className="text-xs text-emerald-600 font-semibold">
                +12% este mes
              </span>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
          <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
            ESTABLE
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-sky-950">{estables}</h3>
            <span className="text-xs text-gray-400">
              {totalPacientes > 0
                ? Math.round((estables / totalPacientes) * 100)
                : 0}
              % del total
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
          <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            MODERADO
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-bold text-sky-950">{moderados}</h3>
            <span className="text-xs text-gray-400">
              {totalPacientes > 0
                ? Math.round((moderados / totalPacientes) * 100)
                : 0}
              % del total
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-bl-lg border-l border-b border-red-100">
            Prioridad
          </div>
          <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
            ALTO RIESGO
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <h3 className="text-3xl font-extrabold text-red-600">
              {altoRiesgo}
            </h3>
          </div>
        </div>
      </section>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-50/70 text-gray-400 text-[11px] uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Correo</th>
              <th className="px-6 py-4">Último Test</th>
              <th className="px-6 py-4">Estado Emocional</th>
              <th className="px-6 py-4">Fecha Registro</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm text-gray-600">
            {filtered.length > 0 ? (
              filtered.map((p) => {
                const initials = p.nombres
                  ? p.nombres
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "US";
                const estado = p.emotional_state || "Estable";
                let badgeStyle =
                  "bg-emerald-50 text-emerald-700 border-emerald-200";
                if (estado === "Moderado")
                  badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
                if (estado === "Alto Riesgo")
                  badgeStyle = "bg-red-50 text-red-700 border-red-200";

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <span className="font-bold text-slate-800">
                        {p.nombres} {p.apellidos || ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.correo}</td>
                    <td className="px-6 py-4 text-xs text-gray-500">N/A</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}
                      >
                        {estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {p.created_at
                        ? new Date(p.created_at).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        title="Eliminar paciente"
                        className="text-gray-400 hover:text-red-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-red-50"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  La base de datos está vacía. No hay pacientes registrados
                  actualmente.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
          <span>
            Mostrando {filtered.length} de {totalPacientes} pacientes
          </span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 border rounded bg-white text-gray-700 font-bold shadow-sm">
              1
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

// ==========================================
// VISTA 4: FUENTES (Subida de Archivos, Icono y Vista Previa)
// ==========================================
const SourcesView = () => {
  const [sources, setSources] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const fetchSources = async () => {
    const { data } = await supabase
      .from("sources")
      .select("*")
      .order("id", { ascending: false });
    if (data) setSources(data);
  };

  useEffect(() => {
    fetchSources();
    const channel = supabase
      .channel("sources-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sources" },
        fetchSources,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Por favor selecciona un archivo primero.");
      return;
    }

    setUploading(true);
    try {
      const limpiarNombre = (nombre) =>
        nombre
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-zA-Z0-9.\-_]/g, "_");

      const fileName = `${Date.now()}_${limpiarNombre(selectedFile.name)}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("sources")
        .upload(fileName, selectedFile);

      if (storageError) throw storageError;

      const type = selectedFile.name.split(".").pop().toUpperCase() || "PDF";

      const { error: dbError } = await supabase
        .from("sources")
        .insert([{ name: fileName, type }]);

      if (dbError) throw dbError;

      setSelectedFile(null);
      alert("¡Guía o manual subido con éxito!");
      fetchSources();
    } catch (error) {
      console.error("Error al subir archivo:", error);
      alert(
        "Error al subir el archivo: " +
          (error.message || "Verifica tu bucket de Supabase Storage"),
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id, fileName) => {
    if (!confirm("¿Deseas eliminar esta guía clínica?")) return;

    await supabase.storage.from("sources").remove([fileName]);
    await supabase.from("sources").delete().eq("id", id);
    fetchSources();
  };

  const handlePreview = (fileName) => {
    const { data } = supabase.storage.from("sources").getPublicUrl(fileName);

    if (data && data.publicUrl) {
      setPreviewFile({ name: fileName, url: data.publicUrl });
    }
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      <header className="bg-white p-4 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold text-sky-950">
          Gestión de Fuentes de Conocimiento
        </h2>
      </header>

      <form
        onSubmit={handleUpload}
        className="border-2 border-dashed border-gray-300 p-8 bg-white flex flex-col items-center justify-center rounded-xl shadow-sm"
      >
        <span className="material-symbols-outlined text-[40px] text-sky-600 mb-2">
          upload_file
        </span>
        <h3 className="text-lg font-bold text-gray-800">
          Sube guías clínicas o manuales
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Selecciona un archivo PDF o documento de texto
        </p>

        <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 items-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="flex-1 bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
          />
          <button
            type="submit"
            disabled={uploading}
            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all disabled:opacity-50"
          >
            {uploading ? "Subiendo..." : "Subir"}
          </button>
        </div>
        {selectedFile && (
          <span className="text-xs text-emerald-600 font-semibold mt-2">
            Archivo seleccionado: {selectedFile.name}
          </span>
        )}
      </form>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-gray-50 text-gray-500 text-xs uppercase">
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {sources.length > 0 ? (
              sources.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                    <span className="material-symbols-outlined text-sky-600 text-[22px]">
                      description
                    </span>
                    <span className="truncate max-w-md" title={s.name}>
                      {s.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold">
                      {s.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handlePreview(s.name)}
                      className="text-sky-600 hover:text-sky-800 cursor-pointer inline-flex items-center gap-1 bg-sky-50 px-3 py-1 rounded-lg text-xs font-semibold border border-sky-200"
                      title="Vista previa"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        visibility
                      </span>
                      Vista previa
                    </button>
                    <button
                      onClick={() => handleDelete(s.id, s.name)}
                      className="text-red-500 hover:text-red-700 cursor-pointer inline-flex items-center gap-1 bg-red-50 px-3 py-1 rounded-lg text-xs font-semibold border border-red-200"
                      title="Eliminar fuente"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No hay fuentes registradas en Supabase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-sky-950 text-base truncate">
                Vista previa: {previewFile.name}
              </h3>
              <button
                onClick={() => setPreviewFile(null)}
                className="text-gray-400 hover:text-gray-700 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-hidden">
              {previewFile.name.toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={previewFile.url}
                  className="w-full h-full rounded-lg border bg-white"
                  title="Vista previa PDF"
                />
              ) : (
                <div className="text-center p-6 space-y-4">
                  <p className="text-sm text-gray-600">
                    Este tipo de archivo no cuenta con previsualización directa
                    en el navegador, pero puedes descargarlo o abrirlo
                    directamente.
                  </p>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-sky-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-sky-700"
                  >
                    Abrir en nueva pestaña
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// ==========================================
// VISTA 5: RECURSOS
// ==========================================
const ResourcesView = () => {
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState("");
  const [cat, setCat] = useState("Relajación");
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState(null);

  const fetchResources = async () => {
    const { data } = await supabase
      .from("resources")
      .select("*")
      .order("id", { ascending: false });
    if (data) setResources(data);
  };

  useEffect(() => {
    fetchResources();
    const channel = supabase
      .channel("resources-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        fetchResources,
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const icon =
      cat === "Relajación"
        ? "air"
        : cat === "Hábitos"
          ? "bedtime"
          : cat === "Terapia Cognitiva"
            ? "mindfulness"
            : "ecg";

    await supabase.from("resources").insert([{ title, cat, icon }]);
    setTitle("");
    setShowModal(false);
    fetchResources();
  };

  const openDeleteModal = (id, resourceTitle) => {
    setResourceToDelete({ id, title: resourceTitle });
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    await supabase.from("resources").delete().eq("id", resourceToDelete.id);
    setResourceToDelete(null);
    fetchResources();
  };

  const filteredResources = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.cat.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <main className="flex-1 p-8 space-y-6 bg-slate-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-sky-950">
            Gestión de recursos
          </h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-sm">
              search
            </span>
            <input
              className="pl-10 pr-4 py-2 bg-gray-50 rounded-full border border-gray-200 focus:ring-2 focus:ring-sky-500 text-sm w-64 outline-none"
              placeholder="Buscar recursos..."
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0369A1] hover:bg-sky-800 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Nuevo recurso
          </button>
        </div>
      </header>

      <div className="relative h-48 rounded-xl overflow-hidden bg-sky-950 shadow-sm flex flex-col justify-end p-8 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-1">Biblioteca de Bienestar</h3>
          <p className="text-sky-200 text-sm max-w-lg">
            Gestiona y actualiza las herramientas terapéuticas y guías de salud
            mental para los pacientes.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-sky-950 mb-4">
              Agregar Nuevo Recurso
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Título
                </label>
                <input
                  type="text"
                  placeholder="Ej: Respiración guiada"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full bg-gray-50 border rounded-lg px-4 py-2 text-sm outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="Relajación">Relajación</option>
                  <option value="Hábitos">Hábitos</option>
                  <option value="Terapia Cognitiva">Terapia Cognitiva</option>
                  <option value="Urgencias">Urgencias</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-900 text-white rounded-lg text-sm font-medium hover:bg-sky-950 cursor-pointer shadow-sm"
                >
                  Guardar Recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-2xl">
                warning
              </span>
            </div>
            <h3 className="text-xl font-bold text-sky-950 mb-2">
              ¿Eliminar este recurso?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Estás a punto de eliminar permanentemente{" "}
              <span className="font-bold">"{resourceToDelete.title}"</span>.
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setResourceToDelete(null)}
                className="flex-1 py-2.5 border rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer shadow-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white border border-[#E2D9CA] rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/70 border-b border-[#E2D9CA] text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Título</th>
              <th className="px-6 py-4 font-semibold">Categoría</th>
              <th className="px-6 py-4 font-semibold">Fecha creación</th>
              <th className="px-6 py-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2D9CA] text-sm">
            {filteredResources.length > 0 ? (
              filteredResources.map((r) => {
                let iconBg = "bg-sky-50 text-sky-600";
                if (r.cat === "Hábitos") iconBg = "bg-amber-50 text-amber-600";
                if (r.cat === "Urgencias") iconBg = "bg-red-50 text-red-600";

                return (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${iconBg}`}>
                          <span className="material-symbols-outlined text-lg">
                            {r.icon || "library_books"}
                          </span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {r.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-[#E0F2FE] text-[#0C4A6E] px-3 py-1 rounded-full text-xs font-medium">
                        {r.cat}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {r.created_at
                        ? new Date(r.created_at).toLocaleDateString()
                        : "Reciente"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-1">
                      <button
                        onClick={() => alert(`Editar recurso: ${r.title}`)}
                        className="p-2 text-gray-400 hover:text-sky-600 transition-colors cursor-pointer rounded-lg hover:bg-sky-50"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(r.id, r.title)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer rounded-lg hover:bg-red-50"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-gray-400"
                >
                  No hay recursos registrados en Supabase. Agrega uno nuevo con
                  el botón superior.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 bg-gray-50/50 border-t border-[#E2D9CA] flex justify-between items-center text-xs text-gray-500">
          <span>
            Mostrando {filteredResources.length} de {resources.length} recursos
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded border bg-white hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <button className="p-1 rounded border bg-white hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
export default DiagnoHealthApp;
