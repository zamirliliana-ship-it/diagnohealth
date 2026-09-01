import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Activity, ArrowLeft } from 'lucide-react';
import { supabase } from '../../config/supabase';

const MAX_INTENTOS = 3;
const BLOQUEO_MS = 5 * 60 * 1000; // 5 minutos
const STORAGE_KEY = 'diagnohealth_login_intentos';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  const navigate = useNavigate();
  const intervaloRef = useRef(null);

  // Al montar, revisa si ya existe un bloqueo vigente guardado
  useEffect(() => {
    const guardado = leerEstadoIntentos();
    if (guardado.bloqueadoHasta && guardado.bloqueadoHasta > Date.now()) {
      setBloqueadoHasta(guardado.bloqueadoHasta);
    }
  }, []);

  // Cuenta regresiva mientras esté bloqueado
  useEffect(() => {
    if (!bloqueadoHasta) {
      setTiempoRestante(0);
      return;
    }

    const actualizar = () => {
      const restante = bloqueadoHasta - Date.now();
      if (restante <= 0) {
        // Se acabó el bloqueo: reinicia todo
        limpiarEstadoIntentos();
        setBloqueadoHasta(null);
        setTiempoRestante(0);
        setErrorMensaje('');
        clearInterval(intervaloRef.current);
      } else {
        setTiempoRestante(restante);
      }
    };

    actualizar();
    intervaloRef.current = setInterval(actualizar, 1000);
    return () => clearInterval(intervaloRef.current);
  }, [bloqueadoHasta]);

  const leerEstadoIntentos = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : { intentos: 0, bloqueadoHasta: null };
    } catch {
      return { intentos: 0, bloqueadoHasta: null };
    }
  };

  const guardarEstadoIntentos = (estado) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
  };

  const limpiarEstadoIntentos = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  const registrarIntentoFallido = () => {
    const estado = leerEstadoIntentos();
    const nuevosIntentos = estado.intentos + 1;

    if (nuevosIntentos >= MAX_INTENTOS) {
      const hasta = Date.now() + BLOQUEO_MS;
      guardarEstadoIntentos({ intentos: 0, bloqueadoHasta: hasta });
      setBloqueadoHasta(hasta);
    } else {
      guardarEstadoIntentos({ intentos: nuevosIntentos, bloqueadoHasta: null });
    }
  };

  const formatearTiempo = (ms) => {
    const totalSegundos = Math.ceil(ms / 1000);
    const minutos = Math.floor(totalSegundos / 60);
    const segundos = totalSegundos % 60;
    return `${minutos}:${segundos.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (bloqueadoHasta && bloqueadoHasta > Date.now()) {
      return; // Seguridad extra: no procesa si está bloqueado
    }

    setErrorMensaje('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        registrarIntentoFallido();
        const estadoActualizado = leerEstadoIntentos();

        if (estadoActualizado.bloqueadoHasta) {
          setErrorMensaje('Demasiados intentos fallidos. Inténtalo de nuevo en 5 minutos.');
        } else {
          setErrorMensaje('Correo o contraseña incorrectos. Verifica tus datos.');
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        limpiarEstadoIntentos();
        navigate('/inicioS', { replace: true });
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setErrorMensaje('Ocurrió un error inesperado. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const estaBloqueado = !!bloqueadoHasta && bloqueadoHasta > Date.now();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAF7F2]">
      
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
        src="/imagenes/2.fondo-diagnohealth.mp4" 
      />

      <div className="absolute inset-0 z-10 bg-black/40"></div>

      <Link 
        to="/" 
        className="absolute top-8 left-8 z-30 flex items-center justify-center rounded-full bg-white/20 p-2 text-white backdrop-blur-md transition-all hover:bg-white/40 focus:outline-none focus:ring-2 focus:ring-white sm:top-10 sm:left-10"
        aria-label="Volver a la página principal"
      >
        <ArrowLeft size={24} aria-hidden="true" />
      </Link>

      <div className="relative z-20 w-full max-w-md p-6 sm:p-8">
        <div className="rounded-3xl bg-white/90 px-8 py-10 shadow-2xl backdrop-blur-md sm:px-10">
          
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#0C4A6E] text-white">
              <Activity size={24} />
            </div>
            <h2 className="text-2xl font-bold text-[#00334F]">DiagnoHealth</h2>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenido de nuevo. Inicia sesión para continuar.
            </p>
          </div>

          {errorMensaje && (
            <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {errorMensaje}
            </div>
          )}

          {estaBloqueado && (
            <div role="alert" className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm font-medium text-amber-800">
              Cuenta bloqueada temporalmente.<br />
              Vuelve a intentarlo en {formatearTiempo(tiempoRestante)}
            </div>
          )}

          <fieldset disabled={estaBloqueado || loading} className="space-y-5">
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#0C4A6E] focus:outline-none focus:ring-1 focus:ring-[#0C4A6E] disabled:bg-gray-100 disabled:text-gray-400"
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
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 focus:border-[#0C4A6E] focus:outline-none focus:ring-1 focus:ring-[#0C4A6E] disabled:bg-gray-100 disabled:text-gray-400"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || estaBloqueado}
                className="mt-6 flex w-full items-center justify-center rounded-lg bg-[#0C4A6E] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#073654] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {estaBloqueado ? "Bloqueado" : loading ? "Iniciando sesión..." : "Iniciar sesión"}
              </button>
            </form>
          </fieldset>

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