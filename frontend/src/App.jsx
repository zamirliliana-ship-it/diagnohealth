import { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "./config/supabase";

import Landing from "./Pages/Home/Landing";
import InicioS from "./Pages/Home/InicioS";
import Registro from "./Pages/Home/Registro";
import Chatbot from "./Pages/Home/Chatbot";
import CrisisAlert from "./Pages/Home/CrisisAlert";
import CerrarSesion from "./Pages/Home/CerrarSesion";
import RecuperarPassword from "./Pages/Home/RecuperarPassword";
import RestablecerPassword from "./Pages/Home/RestablecerPassword";

// ============================================================
// RUTA PROTEGIDA
// ============================================================

function ProtectedRoute({ children }) {
  const location = useLocation();

  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error(
            "Error obteniendo sesión:",
            error
          );
        }

        if (mounted) {
          setSession(session);
        }
      } catch (error) {
        console.error(
          "Error verificando sesión:",
          error
        );

        if (mounted) {
          setSession(null);
        }
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        if (mounted) {
          setSession(newSession);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================================
  // VERIFICANDO SESIÓN
  // ==========================================================

  if (session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2]">

        <div className="text-center">

          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#0369A1]/20 border-t-[#0369A1]" />

          <p className="text-sm text-gray-500">
            Verificando sesión...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================================
  // NO AUTENTICADO
  // ==========================================================

  if (!session) {
    return (
      <Navigate
        to="/inicioS"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ==========================================================
  // AUTENTICADO
  // ==========================================================

  return children;
}

// ============================================================
// APP
// ============================================================

function AppContent() {
  return (
    <Routes>

      {/* ======================================================
          LANDING
          Esta es SIEMPRE la página inicial
      ======================================================= */}

      <Route
        path="/"
        element={<Landing />}
      />

      {/* ======================================================
          AUTENTICACIÓN
      ======================================================= */}

      <Route
        path="/inicioS"
        element={<InicioS />}
      />

      <Route
        path="/registro"
        element={<Registro />}
      />

      {/* ======================================================
          RECUPERAR CONTRASEÑA
      ======================================================= */}

      <Route
        path="/recuperar-password"
        element={<RecuperarPassword />}
      />

      {/* ======================================================
          RESTABLECER CONTRASEÑA
      ======================================================= */}

      <Route
        path="/restablecer-password"
        element={<RestablecerPassword />}
      />

      {/* ======================================================
          CRISIS ALERT
          
          Se mantiene pública porque una persona puede
          necesitar acceder a ayuda inmediatamente.
      ======================================================= */}

      <Route
        path="/crisisAlert"
        element={<CrisisAlert />}
      />

      <Route
        path="/crisis-alert"
        element={<CrisisAlert />}
      />

      {/* ======================================================
          CHATBOT PROTEGIDO
      ======================================================= */}

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      {/* ======================================================
          CERRAR SESIÓN PROTEGIDO
      ======================================================= */}

      <Route
        path="/cerrar-sesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      {/* Compatibilidad con ruta anterior */}

      <Route
        path="/CerrarSesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      {/* ======================================================
          CUALQUIER RUTA DESCONOCIDA
          
          IMPORTANTE:
          Si alguien entra directamente a una ruta inexistente,
          lo mandamos a Landing.
      ======================================================= */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

// ============================================================
// ROOT APP
// ============================================================

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;