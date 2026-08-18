import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Phone,
  ChevronRight,
  Headphones,
  Asterisk,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function CrisisAlert() {
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  /* =========================================================
     ESC
  ========================================================= */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setShowAlert(false);
        navigate("/chatbot");
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [navigate]);

  /* =========================================================
     VOLVER
  ========================================================= */
  const handleBackToChat = () => {
    setShowAlert(false);
    navigate("/chatbot");
  };

  /* =========================================================
     LLAMADA
  ========================================================= */
  const handleCall = () => {
    window.location.href = "tel:106";
  };

  if (!showAlert) {
    return null;
  }

  return (
    // ACCESIBILIDAD: Agregamos role="dialog" y aria-modal="true"
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="titulo-crisis"
      aria-describedby="descripcion-crisis"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-[360px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* CONTENIDO */}
        <div className="px-5 pb-7 pt-8">
          
          {/* ICONO */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50" aria-hidden="true">
            <AlertTriangle
              size={30}
              strokeWidth={2.5}
              className="text-red-600"
            />
          </div>

          {/* TÍTULO */}
          <h1 
            id="titulo-crisis" 
            className="mx-auto max-w-[290px] text-center text-[22px] font-bold leading-tight text-[#202124]"
          >
            Detectamos que puedes
            <br />
            necesitar ayuda
          </h1>

          {/* DESCRIPCIÓN */}
          <p 
            id="descripcion-crisis"
            className="mx-auto mt-3 max-w-[300px] text-center text-[13px] leading-5 text-gray-600"
          >
            No estás solo. Hay personas capacitadas y disponibles para escucharte ahora mismo.
          </p>

          {/* OPCIONES */}
          <div className="mt-5 space-y-2">
            
            {/* 106 */}
            <button
              type="button"
              onClick={() => (window.location.href = "tel:106")}
              aria-label="Llamar a la Línea 106 para Atención en Crisis"
              className="group flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1] transition group-hover:scale-105">
                <Phone size={18} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Atención en Crisis</p>
                <p className="text-base font-semibold text-[#0C4A6E]">Línea 106</p>
              </div>
              <ChevronRight size={20} className="text-gray-500" aria-hidden="true" />
            </button>

            {/* 155 */}
            <button
              type="button"
              onClick={() => (window.location.href = "tel:155")}
              aria-label="Llamar a la Línea 155 para Apoyo Emocional"
              className="group flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1] transition group-hover:scale-105">
                <Headphones size={18} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Apoyo Emocional</p>
                <p className="text-base font-semibold text-[#0C4A6E]">Línea 155</p>
              </div>
              <ChevronRight size={20} className="text-gray-500" aria-hidden="true" />
            </button>

            {/* 123 */}
            <button
              type="button"
              onClick={() => (window.location.href = "tel:123")}
              aria-label="Llamar a la Línea 123 para Emergencias Generales"
              className="group flex w-full items-center gap-3 rounded-lg border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0369A1]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1] transition group-hover:scale-105">
                <Asterisk size={19} aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-500">Emergencias Generales</p>
                <p className="text-base font-semibold text-[#0C4A6E]">Línea 123</p>
              </div>
              <ChevronRight size={20} className="text-gray-500" aria-hidden="true" />
            </button>
          </div>

          {/* LLAMAR - ACCESIBILIDAD: autoFocus para que el lector de pantalla inicie aquí */}
          <button
            type="button"
            autoFocus
            onClick={handleCall}
            aria-label="Llamar a la línea principal de crisis ahora"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#D71920] px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#B91C1C] focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 active:scale-[0.98]"
          >
            <Phone size={18} aria-hidden="true" />
            Llamar ahora
          </button>

          {/* VOLVER */}
          <button
            type="button"
            onClick={handleBackToChat}
            aria-label="Cerrar alerta y volver al chat"
            className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Volver al chat
          </button>

        </div>

        {/* AVISO */}
        <div className="border-t border-gray-200 bg-[#F8F8F7] px-5 py-4">
          <p className="text-center text-[9px] leading-3 text-gray-500" aria-live="polite">
            Esta alerta se generó automáticamente debido a palabras clave detectadas en tu conversación que sugieren que podrías estar pasando por un momento difícil. Tu seguridad es nuestra prioridad.
          </p>
        </div>

      </div>
    </div>
  );
}

export default CrisisAlert;