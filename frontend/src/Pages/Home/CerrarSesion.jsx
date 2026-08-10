import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    MessageSquare,
    History,
    User,
    LogOut,
    Menu,
    X,
    AlertTriangle,
    Smile,
    Dumbbell,
} from "lucide-react";

function CerrarSesion() {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    // Cancelar cierre de sesión
    const handleCancel = () => {
        setShowModal(false);
    };

    // Cerrar sesión
    const handleLogout = () => {
        // Aquí posteriormente podemos agregar:
        // localStorage.removeItem("token");

        navigate("/inicioS");
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">

            {/* =====================================================
          BOTÓN MENÚ MÓVIL
      ====================================================== */}
            <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="fixed left-4 top-4 z-[60] rounded-lg bg-[#0C4A6E] p-2 text-white shadow-md md:hidden"
                aria-label="Abrir menú"
            >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* =====================================================
          SIDEBAR
      ====================================================== */}
            <aside
                className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          bg-[#0C4A6E] text-white shadow-xl
          transition-transform duration-300
          md:translate-x-0
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
            >

                {/* LOGO */}
                <div className="flex h-20 items-center border-b border-white/10 px-5">

                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-bold text-[#0C4A6E]">
                            D
                        </div>

                        <span className="text-lg font-bold tracking-tight">
                            DIAGNOHEALTH
                        </span>

                    </Link>

                </div>

                {/* ===================================================
            MENÚ
        ==================================================== */}
                <nav className="flex-1 space-y-2 px-3 py-7">

                    {/* DASHBOARD */}
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    {/* CHAT CON IA */}
                    <Link
                        to="/chatbot"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        <MessageSquare size={20} />
                        <span>Chat con IA</span>
                    </Link>

                    {/* MIS CAMINOS */}
                    <button
                        type="button"
                        className="flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        <History size={20} />
                        <span>Mis Caminos</span>
                    </button>

                    {/* PERFIL */}
                    <Link
                        to="/inicioS"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-4 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                    >
                        <User size={20} />
                        <span>Perfil</span>
                    </Link>

                </nav>

                {/* ===================================================
            NIVEL DE BIENESTAR
        ==================================================== */}
                <div className="px-4 pb-6">

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">

                        <p className="mb-3 text-sm font-medium text-white">
                            Nivel de Bienestar
                        </p>

                        <div className="h-2 overflow-hidden rounded-full bg-white/10">

                            <div
                                className="h-full rounded-full bg-[#7BC2FF]"
                                style={{ width: "65%" }}
                            />

                        </div>

                    </div>

                </div>

            </aside>

            {/* =====================================================
          FONDO OSCURO PARA MÓVIL
      ====================================================== */}
            {menuOpen && (
                <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    aria-label="Cerrar menú"
                />
            )}

            {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}
            <main className="ml-0 min-h-screen md:ml-64">

                {/* ===================================================
            ENCABEZADO
        ==================================================== */}
                <header className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">

                    <div className="pl-12 md:pl-0">

                        <h1 className="text-2xl font-bold text-[#00334F]">
                            Hola, Usuario
                        </h1>

                        <p className="mt-1 text-gray-500">
                            Bienvenido de nuevo a DIAGNOHEALTH.
                        </p>

                    </div>

                </header>

                {/* ===================================================
            CONTENIDO DE FONDO
        ==================================================== */}
                <section className="px-4 py-8 sm:px-6">

                    <div className="mx-auto max-w-6xl">

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                            {/* TU ÁNIMO */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#CDE5FF]">

                                    <Smile
                                        size={24}
                                        className="text-[#006399]"
                                    />

                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-[#00334F]">
                                    Tu Ánimo
                                </h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    Has registrado una mejora del 15% esta semana.
                                </p>

                            </div>

                            {/* EJERCICIOS */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#CDE5FF]">

                                    <Dumbbell
                                        size={24}
                                        className="text-[#006399]"
                                    />

                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-[#00334F]">
                                    Ejercicios
                                </h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    3 sesiones completadas hoy. ¡Excelente trabajo!
                                </p>

                            </div>

                            {/* HISTORIAL */}
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#CDE5FF]">

                                    <History
                                        size={24}
                                        className="text-[#006399]"
                                    />

                                </div>

                                <h3 className="mb-2 text-lg font-semibold text-[#00334F]">
                                    Historial
                                </h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    Tu última nota fue hace 2 horas.
                                </p>

                            </div>

                        </div>

                    </div>

                </section>

            </main>

            {/* =====================================================
          MODAL CERRAR SESIÓN
      ====================================================== */}
            {showModal && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(12,18,22,0.6)] px-4 backdrop-blur-[4px]">

                    {/* TARJETA */}
                    <div className="w-full max-w-[440px] rounded-xl border border-gray-300 bg-white p-8 text-center shadow-2xl">

                        {/* =================================================
                ICONO
            ================================================== */}
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#E0F2FE]">

                            <LogOut
                                size={32}
                                strokeWidth={2}
                                className="text-[#006399]"
                            />

                        </div>

                        {/* =================================================
                TEXTO
            ================================================== */}
                        <div className="mb-8">

                            <h2 className="mb-2 text-2xl font-semibold text-[#1B1C1A]">
                                ¿Cerrar sesión?
                            </h2>

                            <p className="px-2 text-base leading-6 text-gray-500">
                                Tu progreso está guardado, puedes volver cuando quieras
                            </p>

                        </div>

                        {/* =================================================
                BOTONES
            ================================================== */}
                        <div className="flex w-full flex-col gap-3 sm:flex-row">

                            {/* CANCELAR */}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="order-2 flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-semibold text-[#00334F] transition hover:bg-gray-100 active:scale-95 sm:order-1"
                            >
                                Cancelar
                            </button>

                            {/* CERRAR SESIÓN */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="order-1 flex-1 rounded-lg bg-[#991B1B] py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-95 sm:order-2"
                            >
                                Cerrar sesión
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default CerrarSesion;