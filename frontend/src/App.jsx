import React, { useEffect, useState } from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { supabase } from "./config/supabase";

// ===============================
// PÁGINAS PÚBLICAS
// ===============================

import Landing from "./Pages/Home/Landing";
import Login from "./Pages/Home/Login";
import Registro from "./Pages/Home/Registro";
import RecuperarPassword from "./Pages/Home/RecuperarPassword";
import RestablecerPassword from "./Pages/Home/RestablecerPassword";
import CrisisAlert from "./Pages/Home/CrisisAlert";
import TestBienestar from "./Pages/Home/TestBienestar";

// ===============================
// PÁGINAS DEL USUARIO
// ===============================

import PanelUsuario from "./Pages/Home/PanelUsuario";
import MiProgreso from "./Pages/Home/MiProgreso";
import Chatbot from "./Pages/Home/Chatbot";
import Perfil from "./Pages/Home/Perfil";
import Historial from "./Pages/Home/Historial";
import CerrarSesion from "./Pages/Home/CerrarSesion";

// ===============================
// ADMINISTRACIÓN
// ===============================

import AuthPortal from "./Pages/Admin/sesion";
import DiagnoHealthApp from "./Pages/Admin/Admis";

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

  // ==========================================
  // VERIFICANDO SESIÓN
  // ==========================================

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

  // ==========================================
  // USUARIO NO AUTENTICADO
  // ==========================================

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ==========================================
  // USUARIO AUTENTICADO
  // ==========================================

  return children;
}

// ============================================================
// RUTAS
// ============================================================

function AppContent() {
  return (
    <Routes>

      {/* ===============================
          PÁGINAS PÚBLICAS
      =============================== */}

      <Route path="/" element={<Landing />} />

      <Route
        path="/test-bienestar"
        element={<TestBienestar />}
      />

      <Route path="/login" element={<Login />} />

      {/* Compatibilidad con la ruta antigua */}
      <Route
        path="/inicioS"
        element={<Navigate to="/panel" replace />}
      />

      <Route path="/registro" element={<Registro />} />

      <Route
        path="/recuperar-password"
        element={<RecuperarPassword />}
      />

      <Route
        path="/restablecer-password"
        element={<RestablecerPassword />}
      />

      {/* Crisis puede mantenerse pública */}
      <Route
        path="/crisisAlert"
        element={<CrisisAlert />}
      />

      <Route
        path="/crisis-alert"
        element={<CrisisAlert />}
      />

      {/* ===============================
          ADMINISTRACIÓN
      =============================== */}

      <Route
        path="/admin/login"
        element={<AuthPortal />}
      />

      <Route
        path="/admin/registro"
        element={<AuthPortal />}
      />

      <Route
        path="/admin/admis"
        element={
          <ProtectedRoute>
            <DiagnoHealthApp />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          PANEL PRINCIPAL
      =============================== */}

      <Route
        path="/panel"
        element={
          <ProtectedRoute>
            <PanelUsuario />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          MI PROGRESO
      =============================== */}

      <Route
        path="/mi-progreso"
        element={
          <ProtectedRoute>
            <MiProgreso />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          CHATBOT YAIRA
      =============================== */}

      <Route
        path="/chatbot"
        element={
          <ProtectedRoute>
            <Chatbot />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          HISTORIAL DE YAIRA
      =============================== */}

      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <Historial />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          PERFIL DEL USUARIO
      =============================== */}

      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <Perfil />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          CERRAR SESIÓN
      =============================== */}

      <Route
        path="/cerrar-sesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      {/* Compatibilidad con ruta antigua */}
      <Route
        path="/CerrarSesion"
        element={
          <ProtectedRoute>
            <CerrarSesion />
          </ProtectedRoute>
        }
      />

      {/* ===============================
          RUTA DESCONOCIDA
      =============================== */}

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

// ============================================================
// APP
// ============================================================

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;