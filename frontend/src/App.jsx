import React, { useEffect, useState } from "react";
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
import PanelUsuario from "./Pages/Home/PanelUsuario";
import MiProgreso from "./Pages/Home/MiProgreso";
import Registro from "./Pages/Home/Registro";
import Chatbot from "./Pages/Home/Chatbot";
import CrisisAlert from "./Pages/Home/CrisisAlert";
import CerrarSesion from "./Pages/Home/CerrarSesion";
import RecuperarPassword from "./Pages/Home/RecuperarPassword";
import RestablecerPassword from "./Pages/Home/RestablecerPassword";
import TestBienestar from "./Pages/Home/TestBienestar";

// Importa tu portal unificado de administración y el panel principal
import AuthPortal from "./Pages/Admin/sesion";
import DiagnoHealthApp from "./Pages/Admin/Admis";

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
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
      }
    });

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
          <p className="text-sm text-gray-500">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/sesion"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  return children;
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/test-bienestar" element={<TestBienestar />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/recuperar-password" element={<RecuperarPassword />} />
      <Route path="/restablecer-password" element={<RestablecerPassword />} />
      <Route path="/crisisAlert" element={<CrisisAlert />} />
      <Route path="/crisis-alert" element={<CrisisAlert />} />
      <Route path="/admin/login" element={<AuthPortal />} />
      <Route path="/admin/registro" element={<AuthPortal />} />{" "}
      <Route
        path="/admin/admis"
        element={
          <ProtectedRoute>
            <DiagnoHealthApp />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inicioS"
        element={
          <ProtectedRoute>
            <PanelUsuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-progreso"
        element={
          <ProtectedRoute>
            <MiProgreso />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
