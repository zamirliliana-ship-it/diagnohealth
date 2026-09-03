import React, { useState } from "react";
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
        // Redirige al panel protegido de administración
        window.location.href = "/admin/admis";
      }
    } catch (err) {
      console.error("Error inesperado en login:", err);
    }
  };

  // Lógica de Registro con Supabase
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
      setIsRegister(false); // Cambia automáticamente a la vista de login
    } catch (err) {
      console.error("Error inesperado en registro:", err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center font-sans text-slate-800 antialiased">
      {/* Contenedor Principal de Escritorio (Pantalla Dividida) */}
      <div className="w-full max-w-6xl mx-auto min-h-[650px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 m-4">
        {/* Panel Izquierdo: Imagen Ilustrativa y Branding (Escritorio) */}
        <div className="lg:col-span-5 relative bg-sky-950 text-white flex flex-col justify-between p-10 overflow-hidden">
          {/* Imagen de fondo corporativa/médica con opacidad */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80"
              alt="Médico analizando datos"
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950 via-sky-950/70 to-transparent"></div>
          </div>

          {/* Contenido Superior */}
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

          {/* Contenido Central / Mensaje */}
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

          {/* Contenido Inferior */}
          <div className="relative z-10 text-xs text-sky-400">
            &copy; 2026 DiagnoHealth Systems. Todos los derechos reservados.
          </div>
        </div>

        {/* Panel Derecho: Formularios Interactivos */}
        <div className="lg:col-span-7 p-8 md:p-12 flex flex-col justify-center bg-white overflow-y-auto max-h-[85vh]">
          {!isRegister ? (
            /* VISTA 1: INICIO DE SESIÓN */
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
                {/* Email */}
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

                {/* Password */}
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

                {/* Submit Login */}
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

              {/* Alternar a Registro */}
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
            /* VISTA 2: REGISTRO DE ADMINISTRADOR */
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
                  {/* Nombre Completo */}
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

                  {/* Correo */}
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
                  {/* Contraseña */}
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

                  {/* Rol */}
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

                {/* Fecha de Creación */}
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
                      defaultValue="2026-08-25"
                    />
                  </div>
                </div>

                {/* Submit Register */}
                <div className="pt-2">
                  <button
                    className="w-full py-2.5 bg-sky-900 hover:bg-sky-950 text-white font-medium text-sm rounded-lg transition-colors shadow-sm cursor-pointer"
                    type="submit"
                  >
                    Registrar Administrador
                  </button>
                </div>
              </form>

              {/* Alternar a Login */}
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

export default AuthPortal;
