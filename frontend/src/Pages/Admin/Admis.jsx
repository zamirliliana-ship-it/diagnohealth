import React, { useState } from "react";

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
    <div className="min-h-screen bg-background relative font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderContent()}
    </div>
  );
};

// ==========================================
// MENU LATERAL (SIDEBAR UNIFICADO)
// ==========================================
const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: "panel", icon: "dashboard", label: "Panel" },
    { id: "estadisticas", icon: "bar_chart", label: "Estadísticas" },
    { id: "pacientes", icon: "groups", label: "Pacientes" },
    { id: "fuentes", icon: "database", label: "Fuentes" },
    { id: "recursos", icon: "library_books", label: "Recursos" },
    { id: "roles", icon: "admin_panel_settings", label: "Roles" },
    { id: "dominios", icon: "language", label: "Dominios" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-primary flex flex-col z-40 overflow-y-auto">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
          <span className="material-symbols-outlined text-primary">
            medical_services
          </span>
        </div>
        <div>
          <h1 className="font-headline-md text-[18px] font-bold text-on-primary leading-tight">
            DIAGNOHEALTH
          </h1>
          <p className="font-label-sm text-primary-fixed-dim opacity-80 uppercase tracking-widest mt-1">
            Admin Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
              activeTab === item.id
                ? "bg-primary-container text-on-primary-container border-l-4 border-secondary-container"
                : "text-primary-fixed-dim hover:text-on-primary-fixed hover:bg-primary-container/50"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                activeTab === item.id
                  ? { fontVariationSettings: "'FILL' 1" }
                  : {}
              }
            >
              {item.icon}
            </span>
            <span className="font-label-md text-label-md">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-4 py-6 mt-auto border-t border-primary-container/30">
        <button className="w-full py-3 bg-secondary text-on-primary font-label-md rounded-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[20px]">
            add_chart
          </span>
          Generar Reporte
        </button>
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-primary-fixed-dim hover:text-on-primary-fixed transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label-md text-label-md">Configuración</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-primary-fixed-dim hover:text-on-primary-fixed transition-colors text-error-container hover:text-error">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// VISTA 1: PANEL (DASHBOARD)
// ==========================================
const DashboardView = () => (
  <main className="ml-64 min-h-screen flex flex-col relative">
    <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant">
      <h2 className="font-headline-md text-headline-md text-primary">
        Panel administrativo
      </h2>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-on-surface-variant">
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
        <div className="h-8 w-[1px] bg-outline-variant"></div>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-label-md font-bold text-on-surface">
              Dr. Ricardo Alarcón
            </p>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
              Super Admin
            </p>
          </div>
          <img
            alt="Admin Profile"
            className="w-10 h-10 rounded-full border-2 border-secondary object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNlFU88b8G6XuMTkLFQIWuFONH-MJGISvKJ3wdOPs41KnA9_NAVKJg9WNyX8V5sfpoLAMmNI6ffmXR3s3qWTMFwrLpE1-xPXF47FVg2hgP3VvrWBTuHFCehCNIqSIgTTe4JFRTDPv-Cfp5isE3iph_nNkqkdRDzuURuWVd-eRka0mydsoN3n3TYlvgrK9DI6g9R7MR9M923oGH1IZwn9mmfJYAZY-itTwvw0PV0RVO97_RIMEsA8WJ6P848WKcrxc-zKoKyrWInHo"
          />
        </div>
      </div>
    </header>

    <div className="mt-16 p-8 space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-container-lowest border border-surface-variant p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-label-md text-on-surface-variant mb-1">
              Usuarios activos
            </p>
            <h3 className="font-headline-md text-headline-md text-primary">
              1,240
            </h3>
            <p className="text-[12px] text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                trending_up
              </span>{" "}
              +12% esta semana
            </p>
          </div>
          <div className="p-3 bg-secondary-container/20 rounded-lg text-secondary">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-label-md text-on-surface-variant mb-1">
              Sesiones de chat
            </p>
            <h3 className="font-headline-md text-headline-md text-primary">
              3,891
            </h3>
            <p className="text-[12px] text-on-surface-variant mt-1">
              Total acumulado
            </p>
          </div>
          <div className="p-3 bg-tertiary-fixed rounded-lg text-tertiary">
            <span className="material-symbols-outlined">forum</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant p-6 rounded-xl flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-error text-on-primary text-[10px] font-bold rounded-bl-lg">
            CRÍTICO
          </div>
          <div>
            <p className="text-label-md text-on-surface-variant mb-1">
              Alertas de crisis
            </p>
            <h3 className="font-headline-md text-headline-md text-error">7</h3>
            <p className="text-[12px] text-error mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">
                warning
              </span>{" "}
              Requiere atención
            </p>
          </div>
          <div className="p-3 bg-error-container rounded-lg text-error">
            <span className="material-symbols-outlined">
              notifications_active
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest border border-surface-variant p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-label-md text-on-surface-variant mb-1">
              Tests realizados
            </p>
            <h3 className="font-headline-md text-headline-md text-primary">
              542
            </h3>
            <p className="text-[12px] text-on-surface-variant mt-1">
              Últimos 30 días
            </p>
          </div>
          <div className="p-3 bg-primary-fixed rounded-lg text-primary">
            <span className="material-symbols-outlined">assignment</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-label-md text-lg text-on-surface font-semibold">
              Uso del Chatbot (Últimos 7 días)
            </h4>
            <select className="bg-surface text-label-sm border border-surface-variant rounded-lg px-3 py-1 outline-none">
              <option>Semanal</option>
              <option>Mensual</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {[45, 60, 85, 55, 70, 40, 30].map((h, i) => (
              <div
                key={i}
                className="flex flex-col items-center flex-1 h-full justify-end"
              >
                <div
                  className="w-full bg-secondary rounded-t-lg transition-all"
                  style={{ height: `${h}%` }}
                ></div>
                <span className="text-[10px] mt-2 text-on-surface-variant">
                  {["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-label-md text-lg text-on-surface font-semibold">
              Alertas críticas recientes
            </h4>
            <span className="material-symbols-outlined text-error">
              priority_high
            </span>
          </div>
          <div className="space-y-4">
            {["Mateo Rivera", "Carla Gómez", "Sofía Mendez"].map((name, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-lg border ${i === 0 ? "bg-error-container/10 border-error/10" : "bg-surface border-surface-variant"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${i === 0 ? "bg-error/20 text-error" : "bg-surface-container text-on-surface-variant"}`}
                  >
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface font-bold">
                      {name}
                    </p>
                    <p className="text-label-sm text-on-surface-variant">
                      Hace {i === 0 ? "12 min" : i * 2 + " horas"}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-error text-on-primary text-label-sm rounded-lg hover:opacity-90">
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  </main>
);

// ==========================================
// VISTA 2: ESTADÍSTICAS
// ==========================================
const StatisticsView = () => (
  <main className="ml-64 min-h-screen">
    <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant">
      <div className="flex items-center bg-surface-container rounded-full px-4 py-1.5 w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-label-md font-label-md w-full ml-2 outline-none"
          placeholder="Buscar métricas o reportes..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="h-8 w-px bg-surface-variant mx-2"></div>
        <img
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNlFU88b8G6XuMTkLFQIWuFONH-MJGISvKJ3wdOPs41KnA9_NAVKJg9WNyX8V5sfpoLAMmNI6ffmXR3s3qWTMFwrLpE1-xPXF47FVg2hgP3VvrWBTuHFCehCNIqSIgTTe4JFRTDPv-Cfp5isE3iph_nNkqkdRDzuURuWVd-eRka0mydsoN3n3TYlvgrK9DI6g9R7MR9M923oGH1IZwn9mmfJYAZY-itTwvw0PV0RVO97_RIMEsA8WJ6P848WKcrxc-zKoKyrWInHo"
        />
      </div>
    </header>

    <div className="pt-24 px-8 pb-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-label-sm text-outline mb-2">
            <span>Admin</span>{" "}
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>{" "}
            <span>Estadísticas</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Estadísticas generales
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container rounded-lg p-1">
            <button className="px-4 py-1.5 text-label-sm rounded-md bg-surface shadow-sm text-primary">
              7 Días
            </button>
            <button className="px-4 py-1.5 text-label-sm text-outline hover:text-primary">
              30 Días
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-lg font-label-md bg-surface hover:bg-surface-container">
            <span className="material-symbols-outlined">calendar_today</span>{" "}
            <span>01 Nov - 07 Nov</span>
          </button>
        </div>
      </div>

      <div className="border-b border-outline-variant flex gap-8">
        <button className="pb-3 px-2 text-label-md font-bold text-secondary border-b-2 border-secondary">
          Uso general
        </button>
        <button className="pb-3 px-2 text-label-md font-medium text-on-surface-variant hover:text-primary">
          Segmentación
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Main Line Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-surface-variant rounded-xl p-6">
          <h3 className="font-label-md text-outline">
            Usuarios Activos Diarios (DAU)
          </h3>
          <p className="font-headline-md text-primary">
            4,829{" "}
            <span className="text-label-sm text-green-600 font-normal">
              +12.5%
            </span>
          </p>
          <div className="relative h-64 w-full pt-8 mt-4">
            <svg
              className="absolute inset-0 h-full w-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 800 200"
            >
              <path
                d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80"
                fill="none"
                stroke="#0369A1"
                strokeLinecap="round"
                strokeWidth="4"
              ></path>
              <path
                d="M0,150 Q100,140 200,100 T400,120 T600,60 T800,80 L800,200 L0,200 Z"
                fill="#0369A1"
                opacity="0.1"
              ></path>
              <circle
                cx="200"
                cy="100"
                fill="#0369A1"
                r="6"
                stroke="#fff"
                strokeWidth="2"
              ></circle>
              <circle
                cx="600"
                cy="60"
                fill="#0369A1"
                r="6"
                stroke="#fff"
                strokeWidth="2"
              ></circle>
            </svg>
          </div>
        </div>

        {/* Retention Card */}
        <div className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-label-md opacity-70">Tasa de Retención</h3>
            <p className="font-display-lg mt-2 text-5xl font-bold">78.4%</p>
          </div>
          <div className="mt-8">
            <div className="h-2 w-full bg-primary-container rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-container rounded-full"
                style={{ width: "78%" }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 font-label-sm">
              <span>Meta: 85%</span>
              <span>+4.2%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

// ==========================================
// VISTA 3: PACIENTES
// ==========================================
const PatientsView = () => (
  <main className="ml-64 min-h-screen">
    <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-30 bg-surface/90 backdrop-blur border-b border-surface-variant">
      <h2 className="font-headline-md text-primary">Directorio de pacientes</h2>
      <div className="relative w-80">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
          search
        </span>
        <input
          className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-label-md focus:ring-2 focus:ring-primary/20 outline-none"
          placeholder="Buscar por nombre o correo..."
          type="text"
        />
      </div>
    </header>

    <div className="pt-24 pb-8 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <p className="font-label-sm text-outline mb-1 uppercase tracking-wider">
            Total Pacientes
          </p>
          <span className="text-[32px] font-bold text-primary">1,284</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <p className="font-label-sm text-outline mb-1 uppercase tracking-wider">
            Estable
          </p>
          <span className="text-[32px] font-bold text-primary">842</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <p className="font-label-sm text-outline mb-1 uppercase tracking-wider">
            Moderado
          </p>
          <span className="text-[32px] font-bold text-[#D97706]">312</span>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
          <p className="font-label-sm text-outline mb-1 uppercase tracking-wider">
            Alto Riesgo
          </p>
          <span className="text-[32px] font-bold text-error">130</span>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/50 border-b border-outline-variant/30">
              <th className="px-6 py-4 font-label-md text-outline uppercase">
                Nombre
              </th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">
                Correo
              </th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">
                Estado
              </th>
              <th className="px-6 py-4 font-label-md text-outline uppercase text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {[
              {
                name: "Alejandro Mendoza",
                email: "a.mendoza@email.com",
                state: "Estable",
                bg: "bg-[#E0F2FE]",
                text: "text-[#0369A1]",
              },
              {
                name: "Lucía Castillo",
                email: "lcastillo@domain.org",
                state: "Moderado",
                bg: "bg-[#FEF3C7]",
                text: "text-[#92400E]",
              },
              {
                name: "Roberto Pineda",
                email: "roberto.p@service.com",
                state: "Alto Riesgo",
                bg: "bg-[#FEF2F2]",
                text: "text-[#991B1B]",
              },
            ].map((p, i) => (
              <tr
                key={i}
                className="hover:bg-surface-container-lowest cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 font-bold text-on-surface">
                  {p.name}
                </td>
                <td className="px-6 py-4 text-on-surface-variant">{p.email}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${p.bg} ${p.text}`}
                  >
                    {p.state}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-outline hover:text-primary">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </main>
);

// ==========================================
// VISTA 4: FUENTES
// ==========================================
const SourcesView = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="ml-64 min-h-screen">
      <header className="fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant">
        <h2 className="font-headline-md text-primary">
          Gestión de fuentes de conocimiento
        </h2>
        <button className="bg-[#0369A1] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-all">
          <span className="material-symbols-outlined">add</span> Agregar fuente
        </button>
      </header>

      <div className="pt-24 px-8 pb-8 max-w-6xl mx-auto space-y-8">
        <div className="border-2 border-dashed border-outline-variant p-12 bg-surface-container-lowest flex flex-col items-center justify-center rounded-xl cursor-pointer hover:bg-surface-container transition-colors">
          <span className="material-symbols-outlined text-[40px] text-secondary mb-4">
            upload_file
          </span>
          <h3 className="font-headline-md text-on-surface">
            Arrastra un archivo o haz clic para subir
          </h3>
          <p className="text-on-surface-variant mt-2 text-center">
            Sube guías clínicas (PDF, DOCX, TXT). Máx. 25MB.
          </p>
        </div>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between bg-surface-container-low/50">
            <h3 className="font-headline-md text-primary">
              Fuentes Registradas
            </h3>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-high/30">
                <th className="px-6 py-4 font-label-md text-on-surface-variant">
                  Nombre
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant">
                  Tipo
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {[
                "Guía_Protocolo_Ansiedad_2024.pdf",
                "Manual_Operativo_V2.docx",
              ].map((doc, i) => (
                <tr
                  key={i}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-6 py-4 font-body-md font-medium text-on-surface">
                    {doc}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-xs">
                      {doc.split(".")[1].toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setShowModal(true)}
                      className="p-2 text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-8 text-center shadow-xl">
            <span className="material-symbols-outlined text-[32px] text-error mb-4">
              warning
            </span>
            <h3 className="font-headline-md text-on-surface mb-2">
              ¿Eliminar fuente?
            </h3>
            <p className="text-on-surface-variant mb-8">
              Esta acción es permanente y eliminará la información indexada.
              ¿Deseas continuar?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-outline-variant rounded-lg hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-error text-white rounded-lg hover:opacity-90"
              >
                Eliminar
              </button>
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
  const [modalResource, setModalResource] = useState(null);

  const resources = [
    { title: "Respiración 4-7-8", cat: "Relajación", icon: "air" },
    { title: "Higiene del sueño", cat: "Hábitos", icon: "bedtime" },
    {
      title: "Mindfulness Diario",
      cat: "Terapia Cognitiva",
      icon: "mindfulness",
    },
  ];

  return (
    <main className="ml-64 min-h-screen flex flex-col">
      <header className="fixed top-0 right-0 left-64 h-16 bg-surface/80 backdrop-blur-md flex justify-between items-center px-8 z-30 border-b border-surface-variant">
        <h2 className="font-headline-md text-primary">Gestión de recursos</h2>
        <button className="bg-[#0369A1] text-white px-5 py-2 rounded-lg font-label-md flex items-center gap-2">
          <span className="material-symbols-outlined">add</span> + Nuevo recurso
        </button>
      </header>

      <div className="mt-16 p-8 flex-1">
        <div className="mb-8 p-8 h-48 rounded-xl bg-primary-container flex flex-col justify-end">
          <h3 className="text-on-primary font-headline-lg font-bold">
            Biblioteca de Bienestar
          </h3>
          <p className="text-on-primary-container">
            Gestiona y actualiza las herramientas terapéuticas y guías.
          </p>
        </div>

        <div className="bg-white border border-[#E2D9CA] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-[#E2D9CA]">
                <th className="px-6 py-4 font-label-md text-on-surface-variant">
                  Título
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant">
                  Categoría
                </th>
                <th className="px-6 py-4 font-label-md text-on-surface-variant text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2D9CA]">
              {resources.map((res, i) => (
                <tr
                  key={i}
                  className="hover:bg-surface-container-lowest transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <span className="material-symbols-outlined p-2 bg-primary-fixed rounded-lg">
                      {res.icon}
                    </span>
                    <span className="font-medium">{res.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-[#E0F2FE] text-[#0C4A6E] px-3 py-1 rounded-full text-sm">
                      {res.cat}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-outline hover:text-primary">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button
                      onClick={() => setModalResource(res.title)}
                      className="p-2 text-outline hover:text-error"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-8 shadow-2xl text-center">
            <span className="material-symbols-outlined text-[32px] text-error mb-4">
              warning
            </span>
            <h3 className="font-headline-md text-primary mb-2">
              ¿Eliminar este recurso?
            </h3>
            <p className="text-on-surface-variant mb-8">
              Estás a punto de eliminar permanentemente "
              <span className="font-bold">{modalResource}</span>".
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setModalResource(null)}
                className="flex-1 py-3 border rounded-lg hover:bg-surface-container"
              >
                Cancelar
              </button>
              <button
                onClick={() => setModalResource(null)}
                className="flex-1 py-3 bg-error text-white rounded-lg hover:bg-red-700"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default DiagnoHealthApp;
