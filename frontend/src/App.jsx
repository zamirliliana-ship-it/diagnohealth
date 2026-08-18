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
import Login from "./Pages/Home/Login"; 
import InicioS from "./Pages/Home/InicioS";
import Registro from "./Pages/Home/Registro";
import Chatbot from "./Pages/Home/Chatbot";
import CrisisAlert from "./Pages/Home/CrisisAlert";
import CerrarSesion from "./Pages/Home/CerrarSesion";
import RecuperarPassword from "./Pages/Home/RecuperarPassword";
import RestablecerPassword from "./Pages/Home/RestablecerPassword";
import TestBienestar from "./Pages/Home/TestBienestar"; // <-- IMPORTACIÓN DEL TEST

// ============================================================
// RUTA PROTEGIDA
// ============================================================

function ProtectedRoute({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let mounted = true;

    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error obteniendo sesión:", error);
        }

        if (mounted) {
          setSession(session);
        }
      } catch (error) {
        console.error("Error verificando sesión:", error);

        if (mounted) {
          setSession(null);
        }
      }
    };

    getSession();

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

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

// ============================================================
// CONTENIDO DE LA APLICACIÓN
// ============================================================

function AppContent() {
  return (
    <Routes>
      {/* RUTA PRINCIPAL */}
      <Route path="/" element={<Landing />} />

      {/* RUTA PÚBLICA DEL TEST */}
      <Route path="/test-bienestar" element={<TestBienestar />} />

      {/* AUTENTICACIÓN Y RUTAS */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/restablecer-password" element={<RestablecerPassword />} />
      <Route path="/crisisAlert" element={<CrisisAlert />} />
      <Route path="/crisis-alert" element={<CrisisAlert />} />

      {/* RUTAS PROTEGIDAS */}
      <Route
        path="/inicioS"
        element={
          <ProtectedRoute>
            <InicioS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cerrar-sesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      <Route
        path="/CerrarSesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      {/* RUTA DESCONOCIDA */}
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
// APP PRINCIPAL
// ============================================================

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;