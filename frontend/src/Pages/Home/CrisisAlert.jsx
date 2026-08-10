import { useEffect, useState } from "react";
import { AlertTriangle, Phone, ChevronRight, Headphones, Asterisk } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CrisisAlert() {
    const navigate = useNavigate();

    const [showAlert, setShowAlert] = useState(true);

    // Cerrar con la tecla ESC
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

    // Volver al chatbot
    const handleBackToChat = () => {
        setShowAlert(false);
        navigate("/chatbot");
    };

    // Llamar
    const handleCall = () => {
        window.location.href = "tel:106";
    };

    if (!showAlert) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">

            {/* =====================================================
          TARJETA DE ALERTA
      ====================================================== */}
            <div className="w-full max-w-[325px] overflow-hidden rounded-xl bg-white shadow-2xl sm:max-w-[360px]">

                {/* ===================================================
            CONTENIDO PRINCIPAL
        ==================================================== */}
                <div className="px-5 pb-7 pt-8">

                    {/* ICONO DE ALERTA */}
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">

                        <AlertTriangle
                            size={30}
                            strokeWidth={2.5}
                            className="text-red-600"
                            fill="currentColor"
                        />

                    </div>

                    {/* TÍTULO */}
                    <h1 className="mx-auto max-w-[290px] text-center text-[22px] font-bold leading-tight text-[#202124]">
                        Detectamos que puedes
                        <br />
                        necesitar ayuda
                    </h1>

                    {/* DESCRIPCIÓN */}
                    <p className="mx-auto mt-3 max-w-[280px] text-center text-[13px] leading-5 text-gray-600">
                        No estás solo. Hay personas capacitadas y
                        <br />
                        disponibles para escucharte ahora mismo.
                    </p>

                    {/* =================================================
              OPCIONES DE AYUDA
          ================================================== */}
                    <div className="mt-4 space-y-2">

                        {/* LÍNEA 106 */}
                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "tel:106";
                            }}
                            className="flex w-full items-center gap-3 rounded-md border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1]">
                                <Phone size={18} />
                            </div>

                            <div className="flex-1">

                                <p className="text-[10px] leading-3 text-gray-500">
                                    Atención en Crisis
                                </p>

                                <p className="text-base font-semibold text-[#0C4A6E]">
                                    Línea 106
                                </p>

                            </div>

                            <ChevronRight
                                size={20}
                                className="text-gray-500"
                            />

                        </button>

                        {/* LÍNEA 155 */}
                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "tel:155";
                            }}
                            className="flex w-full items-center gap-3 rounded-md border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1]">
                                <Headphones size={18} />
                            </div>

                            <div className="flex-1">

                                <p className="text-[10px] leading-3 text-gray-500">
                                    Apoyo Emocional
                                </p>

                                <p className="text-base font-semibold text-[#0C4A6E]">
                                    Línea 155
                                </p>

                            </div>

                            <ChevronRight
                                size={20}
                                className="text-gray-500"
                            />

                        </button>

                        {/* LÍNEA 123 */}
                        <button
                            type="button"
                            onClick={() => {
                                window.location.href = "tel:123";
                            }}
                            className="flex w-full items-center gap-3 rounded-md border border-gray-300 bg-[#F8F8F7] px-3 py-3 text-left transition hover:bg-gray-100"
                        >

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#0369A1]">
                                <Asterisk size={19} />
                            </div>

                            <div className="flex-1">

                                <p className="text-[10px] leading-3 text-gray-500">
                                    Emergencias Generales
                                </p>

                                <p className="text-base font-semibold text-[#0C4A6E]">
                                    Línea 123
                                </p>

                            </div>

                            <ChevronRight
                                size={20}
                                className="text-gray-500"
                            />

                        </button>

                    </div>

                    {/* =================================================
              BOTÓN LLAMAR AHORA
          ================================================== */}
                    <button
                        type="button"
                        onClick={handleCall}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-[#D71920] px-4 py-3 text-base font-bold text-white shadow-sm transition hover:bg-[#B91C1C] active:scale-[0.98]"
                    >
                        <Phone size={18} />
                        Llamar ahora
                    </button>

                    {/* =================================================
              VOLVER AL CHAT
          ================================================== */}
                    <button
                        type="button"
                        onClick={handleBackToChat}
                        className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        Volver al chat
                    </button>

                </div>

                {/* ===================================================
            AVISO INFERIOR
        ==================================================== */}
                <div className="border-t border-gray-200 bg-[#F8F8F7] px-5 py-4">

                    <p className="text-center text-[9px] leading-3 text-gray-500">
                        Esta alerta se generó automáticamente debido a palabras clave
                        detectadas en tu conversación que sugieren que podrías estar
                        pasando por un momento difícil. Tu seguridad es nuestra prioridad.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default CrisisAlert;