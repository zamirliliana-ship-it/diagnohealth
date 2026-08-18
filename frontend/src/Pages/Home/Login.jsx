import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react'; // <-- IMPORTAMOS ArrowLeft
import { supabase } from '../../config/supabase'; // Ruta a tu cliente de Supabase

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [loading, setLoading] = useState(false); // Estado para evitar múltiples clics
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMensaje(''); // Limpiamos errores previos
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setErrorMensaje('Correo o contraseña incorrectos. Verifica tus datos.');
        setLoading(false);
        return;
      }

      if (data.user) {
        // ¡Inicio de sesión exitoso! Redirigimos a la pantalla principal
        navigate('/inicioS', { replace: true });
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setErrorMensaje('Ocurrió un error inesperado. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF7F2]">
      
      {/* 1. VIDEO DE FONDO INMERSIVO */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
        src="/imagenes/2.fondo-diagnohealth.mp4" 
      />

      {/* Capa oscura semitransparente para que el formulario y texto resalten */}
      <div className="absolute inset-0 z-10 bg-black/40"></div>

      {/* =========================================
          NUEVO: BOTÓN VOLVER ATRÁS
      ========================================= */}
      <Link 
        to="/" 
        className="absolute top-8 left-8 z-30 flex items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white sm:top-10 sm:left-10"
        aria-label="Volver a la página principal"
      >
        <ArrowLeft size={24} aria-hidden="true" />
      </Link>

      {/* 2. FORMULARIO CON EFECTO GLASSMORPHISM */}
      <div className="relative z-20 w-full max-w-md p-6 sm:p-8">
        <div className="rounded-3xl bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-10">
          
          {/* Encabezado */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0C4A6E] text-white">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#00334F]">DiagnoHealth</h2>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido de nuevo. Inicia sesión para continuar.
            </p>
          </div>

          {/* Mensaje de error si las credenciales fallan */}
          {errorMensaje && (
            <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMensaje}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input 
                type="email" 
                placeholder="ejemplo@correo.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#0C4A6E] focus:outline-none focus:ring-1 focus:ring-[#0C4A6E]"
              />
            </div>
            
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link to="/recuperar-password" className="text-xs font-medium text-[#0C4A6E] hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#0C4A6E] focus:outline-none focus:ring-1 focus:ring-[#0C4A6E]"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#0C4A6E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073654] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Enlace a Registro */}
          <div className="mt-8 text-center text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="font-semibold text-[#0C4A6E] hover:underline">
              Regístrate aquí
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}