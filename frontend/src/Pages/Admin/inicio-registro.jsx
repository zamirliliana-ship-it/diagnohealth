import React, { useState } from "react";
import { supabase } from "../../config/supabase"; // Ajusta la ruta según tu estructura

export default function AdminAuthModule() {
  // Estado para alternar entre login (false) y registro (true)
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados para el formulario de Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Estados para el formulario de Registro
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "analista",
  });

  // Estados generales de control
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Manejador para los inputs del registro
  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lógica de Inicio de Sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;
      alert("¡Inicio de sesión exitoso!");
      // Aquí puedes redirigir a tu panel interno de admin
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role,
          },
        },
      });

      if (error) throw error;

      setSuccessMsg("¡Administrador registrado con éxito!");
      setFormData({ fullName: "", email: "", password: "", role: "analista" });
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-200 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-100 opacity-10 blur-3xl"></div>
      </div>

      {!isRegistering ? (
        /* ================= VISTA DE INICIO DE SESIÓN ================= */
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-[0px_4px_20px_rgba(12,74,110,0.08)] p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-sky-600"></div>

          <div className="mb-6 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mb-2">
              <span
                className="material-symbols-outlined text-[32px] text-sky-600"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                admin_panel_settings
              </span>
            </div>
            <h1 className="text-2xl font-bold text-sky-700 tracking-tight">
              DIAGNOHEALTH
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Acceso al Panel de Administración
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="login-email"
              >
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">
                    mail
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  id="login-email"
                  type="email"
                  placeholder="admin@diagnohealth.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="login-password"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400 text-[20px]">
                    lock
                  </span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-600 focus:border-transparent"
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg transition-colors flex justify-center items-center gap-2 cursor-pointer"
            >
              {loading ? "Verificando..." : "Iniciar Sesión"}
              <span className="material-symbols-outlined text-[20px]">
                login
              </span>
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center space-y-3">
            <a href="#" className="text-sm text-sky-600 hover:underline">
              Olvidé mi contraseña
            </a>
            <div className="w-full border-t border-gray-200"></div>
            <button
              onClick={() => {
                setIsRegistering(true);
                setErrorMsg("");
              }}
              className="text-sm text-gray-700 hover:text-sky-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              Registrar nuevo administrador
              <span className="material-symbols-outlined text-[16px]">
                person_add
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= VISTA DE REGISTRO ================= */
        <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-sky-700 tracking-tight">
              DIAGNOHEALTH
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Portal de Administración
            </p>
          </div>

          <div className="w-full bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Registro de Administrador
              </h2>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="fullName"
                    >
                      Nombre completo
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                        person
                      </span>
                      <input
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-sky-600 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="Nombre completo"
                        value={formData.fullName}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="reg-email"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                        mail
                      </span>
                      <input
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-sky-600 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                        id="reg-email"
                        name="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-1">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="reg-password"
                    >
                      Contraseña
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                        lock
                      </span>
                      <input
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-sky-600 focus:ring-2 focus:ring-sky-600 focus:outline-none"
                        id="reg-password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1">
                    <label
                      className="text-sm font-medium text-gray-700"
                      htmlFor="role"
                    >
                      Rol
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                        badge
                      </span>
                      <select
                        className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-sky-600 focus:ring-2 focus:ring-sky-600 focus:outline-none appearance-none"
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleRegisterChange}
                        required
                      >
                        <option value="super_admin">super_admin</option>
                        <option value="gestor_contenido">
                          gestor_contenido
                        </option>
                        <option value="gestor_usuarios">gestor_usuarios</option>
                        <option value="analista">analista</option>
                      </select>
                      <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="createdAt"
                  >
                    Fecha de creación
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 material-symbols-outlined">
                      calendar_today
                    </span>
                    <input
                      className="w-full pl-10 pr-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                      id="createdAt"
                      type="date"
                      value={new Date().toISOString().split("T")[0]}
                      readOnly
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg transition-colors flex justify-center items-center shadow-sm cursor-pointer"
                  >
                    {loading ? "Registrando..." : "Registrar Administrador"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-gray-50 py-3 px-6 text-center border-t border-gray-200">
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-sm text-sky-600 hover:underline cursor-pointer"
              >
                ¿Ya tienes cuenta? Iniciar sesión
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
