import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus, Home, Heart, AlertTriangle, ShieldCheck, Smile, BarChart2, Printer, Phone, ClipboardList, Clock, Lock, Play } from 'lucide-react';
import { supabase } from '../../config/supabase';

const PREGUNTAS = [
  {
    id: 1,
    texto: "Durante la última semana, ¿con qué frecuencia te has sentido decaído, deprimido o sin esperanzas?",
    opciones: [
      { valor: 'tristeza', peso: 1, etiqueta: "Ningún día" },
      { valor: 'tristeza', peso: 2, etiqueta: "Varios días" },
      { valor: 'tristeza', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'tristeza', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 2,
    texto: "¿Has sentido poco interés o placer en hacer las cosas que normalmente disfrutas?",
    opciones: [
      { valor: 'apatia', peso: 1, etiqueta: "Para nada" },
      { valor: 'apatia', peso: 2, etiqueta: "Varios días" },
      { valor: 'apatia', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'apatia', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 3,
    texto: "¿Te has sentido nervioso, ansioso, con los 'nervios de punta' o incapaz de parar?",
    opciones: [
      { valor: 'ansiedad', peso: 1, etiqueta: "Ningún día" },
      { valor: 'ansiedad', peso: 2, etiqueta: "Varios días" },
      { valor: 'ansiedad', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'ansiedad', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 4,
    texto: "¿Has experimentado problemas para conciliar el sueño, mantenerlo o has dormido demasiado?",
    opciones: [
      { valor: 'fatiga', peso: 1, etiqueta: "Ningún día" },
      { valor: 'fatiga', peso: 2, etiqueta: "Varios días" },
      { valor: 'fatiga', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'fatiga', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 5,
    texto: "En general, ¿cómo calificarías tu nivel de energía y bienestar para afrontar el día?",
    opciones: [
      { valor: 'bienestar', peso: 4, etiqueta: "Muy bueno y tranquilo" },
      { valor: 'bienestar', peso: 3, etiqueta: "Regular, tolerable" },
      { valor: 'fatiga', peso: 2, etiqueta: "Bajo, me cuesta mucho" },
      { valor: 'tristeza', peso: 1, etiqueta: "Extremadamente agotado" }
    ]
  },
  {
    id: 6,
    texto: "¿Te ha costado concentrarte en tareas cotidianas, como leer, trabajar o ver televisión?",
    opciones: [
      { valor: 'apatia', peso: 1, etiqueta: "Ningún día" },
      { valor: 'apatia', peso: 2, etiqueta: "Varios días" },
      { valor: 'apatia', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'apatia', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 7,
    texto: "¿Has sentido que eres un fracaso o que has decepcionado a tu familia o a ti mismo?",
    opciones: [
      { valor: 'tristeza', peso: 1, etiqueta: "Ningún día" },
      { valor: 'tristeza', peso: 2, etiqueta: "Varios días" },
      { valor: 'tristeza', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'tristeza', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 8,
    texto: "¿Te has preocupado excesivamente por diferentes situaciones, sin poder controlarlo?",
    opciones: [
      { valor: 'ansiedad', peso: 1, etiqueta: "Ningún día" },
      { valor: 'ansiedad', peso: 2, etiqueta: "Varios días" },
      { valor: 'ansiedad', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'ansiedad', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 9,
    texto: "¿Has preferido aislarte o evitar el contacto con otras personas últimamente?",
    opciones: [
      { valor: 'apatia', peso: 1, etiqueta: "Ningún día" },
      { valor: 'apatia', peso: 2, etiqueta: "Varios días" },
      { valor: 'apatia', peso: 3, etiqueta: "Más de la mitad de los días" },
      { valor: 'apatia', peso: 4, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 10,
    texto: "¿Qué tan capaz te sientes de manejar los retos que se presentan en tu día a día?",
    opciones: [
      { valor: 'bienestar', peso: 4, etiqueta: "Muy capaz, con confianza" },
      { valor: 'bienestar', peso: 3, etiqueta: "Capaz, aunque con esfuerzo" },
      { valor: 'ansiedad', peso: 2, etiqueta: "Poco capaz, me abruma con facilidad" },
      { valor: 'tristeza', peso: 1, etiqueta: "Incapaz, siento que no puedo con nada" }
    ]
  }
];

export default function TestBienestar() {
  const navigate = useNavigate();
  const [testIniciado, setTestIniciado] = useState(false);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [testCompletado, setTestCompletado] = useState(false);
  const [analisisResultado, setAnalisisResultado] = useState(null);
  const [esCrisis, setEsCrisis] = useState(false); // Detección de crisis
  
  const [esInvitado, setEsInvitado] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const preguntaActual = PREGUNTAS[indicePregunta];
  const progreso = (indicePregunta / PREGUNTAS.length) * 100;
  const tieneRespuesta = respuestas[preguntaActual.id] !== undefined;

  useEffect(() => {
    const verificarSesion = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setEsInvitado(!session);
    };
    verificarSesion();
  }, []);

  const handleSeleccion = (opcion) => {
    setRespuestas({ 
      ...respuestas, 
      [preguntaActual.id]: opcion 
    });
  };

  const procesarResultadosTest = (respuestasFinales) => {
    const conteo = { ansiedad: 0, tristeza: 0, apatia: 0, fatiga: 0, bienestar: 0 };

    Object.values(respuestasFinales).forEach((op) => {
      if (conteo[op.valor] !== undefined) {
        conteo[op.valor] += op.peso;
      }
    });

    const totalPuntos = Object.values(conteo).reduce((a, b) => a + b, 1);

    const porcentajes = {
      ansiedad: Math.round((conteo.ansiedad / totalPuntos) * 100),
      tristeza: Math.round((conteo.tristeza / totalPuntos) * 100),
      apatia: Math.round((conteo.apatia / totalPuntos) * 100),
      fatiga: Math.round((conteo.fatiga / totalPuntos) * 100),
      bienestar: Math.round((conteo.bienestar / totalPuntos) * 100),
    };

    let mayorEmocion = 'bienestar';
    let maxPuntaje = -1;

    Object.keys(conteo).forEach((emocion) => {
      if (conteo[emocion] > maxPuntaje) {
        maxPuntaje = conteo[emocion];
        mayorEmocion = emocion;
      }
    });

    // Detección automática de crisis si la ansiedad o tristeza acumulan puntaje crítico
    if (conteo.ansiedad >= 10 || conteo.tristeza >= 10) {
      setEsCrisis(true);
    }

    const mapaResultados = {
      ansiedad: {
        titulo: "Ansiedad o Agitación Elevada",
        descripcion: "Tus respuestas reflejan tensión y preocupación constante. Recomendación: Practica respiración diafragmática y limita el uso de pantallas.",
        icono: AlertTriangle,
        color: "text-amber-600"
      },
      tristeza: {
        titulo: "Tendencia al Decaimiento",
        descripcion: "Has reportado desánimo frecuente. Recomendación: Comparte lo que sientes con una persona de confianza y busca espacios seguros.",
        icono: Heart,
        color: "text-red-600"
      },
      apatia: {
        titulo: "Apatía o Fatiga Emocional",
        descripcion: "Se detecta falta de motivación. Recomendación: Divide tus tareas diarias en pequeños pasos alcanzables.",
        icono: ShieldCheck,
        color: "text-blue-600"
      },
      fatiga: {
        titulo: "Agotamiento Físico y Mental",
        descripcion: "Tu cuerpo demanda recuperación. Recomendación: Prioriza un horario de descanso constante y pausas activas.",
        icono: AlertTriangle,
        color: "text-purple-600"
      },
      bienestar: {
        titulo: "Estabilidad y Bienestar",
        descripcion: "Tus indicadores muestran un equilibrio emocional saludable. Recomendación: Continúa practicando tus hábitos de autocuidado.",
        icono: Smile,
        color: "text-green-600"
      }
    };

    return {
      predominante: mapaResultados[mayorEmocion],
      porcentajes: porcentajes
    };
  };

  const handleSiguiente = async () => {
    if (indicePregunta < PREGUNTAS.length - 1) {
      setIndicePregunta(indicePregunta + 1);
    } else {
      setGuardando(true);
      
      const resultado = procesarResultadosTest(respuestas);
      setAnalisisResultado(resultado);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        try {
          await supabase.from('resultados_test').insert({
            user_id: session.user.id,
            emocion_predominante: resultado.predominante.titulo,
            detalle: resultado.predominante.descripcion,
            respuestas: respuestas
          });
          setEsInvitado(false);
        } catch (err) {
          console.error("Error al guardar en Supabase:", err);
        }
      } else {
        setEsInvitado(true);
      }

      setGuardando(false);
      setTestCompletado(true);
    }
  };

  const handleAnterior = () => {
    if (indicePregunta > 0) {
      setIndicePregunta(indicePregunta - 1);
    } else {
      // Si está en la primera pregunta, regresa a la pantalla previa en vez de salir del test
      setTestIniciado(false);
    }
  };

  // Función para exportar a PDF / Imprimir reporte clínico
  const handleExportarPDF = () => {
    window.print();
  };

  // PANTALLA PREVIA: se muestra antes de comenzar el test
  if (!testIniciado) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 font-sans sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <header className="mb-8 flex items-center justify-between">
            <button
              onClick={() => navigate(esInvitado ? '/' : '/inicioS')}
              aria-label="Volver atrás"
              className="rounded-full p-2 text-gray-600 transition hover:bg-gray-200"
            >
              <ArrowLeft size={24} aria-hidden="true" />
            </button>
            <h1 className="text-lg font-bold text-[#00334F]">Test de Bienestar Emocional</h1>
            <div className="w-10" aria-hidden="true"></div>
          </header>

          <main className="rounded-3xl bg-white p-6 shadow-sm sm:p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F0F9FF] text-[#0C4A6E]">
              <ClipboardList size={32} aria-hidden="true" />
            </div>

            <h2 className="text-2xl font-bold text-[#00334F] mb-3">Antes de comenzar</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Este test es una breve autoevaluación de tu estado emocional durante la última semana.
              Tus respuestas nos ayudan a ofrecerte recomendaciones personalizadas.
            </p>

            <div className="space-y-3 text-left mb-6">
              <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] p-3 border border-gray-200">
                <Clock size={20} className="mt-0.5 shrink-0 text-[#0C4A6E]" aria-hidden="true" />
                <p className="text-sm text-gray-700">
                  Toma menos de 2 minutos: son {PREGUNTAS.length} preguntas sencillas.
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] p-3 border border-gray-200">
                <Lock size={20} className="mt-0.5 shrink-0 text-[#0C4A6E]" aria-hidden="true" />
                <p className="text-sm text-gray-700">
                  {esInvitado
                    ? "Puedes hacerlo como invitado. Si quieres guardar tu historial, podrás registrarte al final."
                    : "Tus resultados se guardarán en tu cuenta de forma privada."}
                </p>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-[#FAF7F2] p-3 border border-gray-200">
                <ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#0C4A6E]" aria-hidden="true" />
                <p className="text-sm text-gray-700">
                  No hay respuestas correctas o incorrectas: responde con sinceridad según cómo te has sentido.
                </p>
              </div>
            </div>

            <button
              onClick={() => setTestIniciado(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-[#073654]"
            >
              <Play size={20} aria-hidden="true" /> Comenzar evaluación
            </button>
          </main>
        </div>
      </div>
    );
  }

  if (testCompletado && analisisResultado) {
    const { predominante, porcentajes } = analisisResultado;
    const IconoResultado = predominante.icono;

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] p-4">
        <div className="w-full max-w-xl rounded-3xl bg-white p-6 md:p-8 shadow-xl" role="alert" aria-live="assertive">
          
          {/* ALERTA DE CRISIS INTEGRADA SI SE DETECTAN NIVELES CRÍTICOS */}
          {esCrisis && (
            <div className="mb-6 rounded-2xl bg-red-50 border-2 border-red-500 p-4 text-center animate-pulse">
              <div className="flex items-center justify-center gap-2 text-red-700 font-bold mb-1">
                <AlertTriangle size={20} />
                <span>Atención Prioritaria Recomendada</span>
              </div>
              <p className="text-xs text-red-600 mb-3">
                Hemos detectado indicadores altos de malestar emocional. No estás solo, comunícate con la línea de ayuda inmediata.
              </p>
              <a
                href="tel:106"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-700"
              >
                <Phone size={16} /> Llamar a Línea 106
              </a>
            </div>
          )}

          <div className="text-center">
            <div className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 ${predominante.color}`}>
              <IconoResultado size={32} aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-[#00334F]">Resultado de tu Evaluación</h2>
          </div>

          <div className="my-5 rounded-2xl bg-gray-50 p-5 border border-gray-200">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Estado Emocional Predominante:</span>
            <h3 className={`text-xl font-extrabold mt-1 ${predominante.color}`}>
              {predominante.titulo}
            </h3>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              {predominante.descripcion}
            </p>
          </div>

          <div className="mb-6 rounded-2xl bg-[#FAF7F2] p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-3 text-[#00334F] font-bold text-sm">
              <BarChart2 size={18} />
              <span>Desglose de tu Estado Emocional</span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Ansiedad", val: porcentajes.ansiedad, color: "bg-amber-500" },
                { label: "Tristeza", val: porcentajes.tristeza, color: "bg-red-500" },
                { label: "Apatía", val: porcentajes.apatia, color: "bg-blue-500" },
                { label: "Fatiga", val: porcentajes.fatiga, color: "bg-purple-500" },
                { label: "Bienestar", val: porcentajes.bienestar, color: "bg-green-500" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} transition-all duration-700`} style={{ width: `${item.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÓN EXPORTAR A PDF */}
          <button
            onClick={handleExportarPDF}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#0C4A6E] bg-white py-3.5 font-bold text-[#0C4A6E] transition hover:bg-sky-50"
          >
            <Printer size={18} /> Descargar / Imprimir Reporte en PDF
          </button>

          {esInvitado ? (
            <div>
              <p className="mb-4 text-xs text-gray-500 text-center">
                Para guardar este historial en tu cuenta, regístrate gratis.
              </p>
              <button
                onClick={() => navigate('/registro')}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] py-3.5 font-bold text-white transition hover:bg-[#073654]"
              >
                <UserPlus size={18} /> Crear mi cuenta
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white py-3.5 font-bold text-gray-600 transition hover:bg-gray-50"
              >
                <Home size={18} /> Volver al inicio
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => navigate('/inicioS')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] py-3.5 font-bold text-white transition hover:bg-[#073654]"
              >
                <Home size={18} /> Volver a mi panel
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 font-sans sm:px-6">
      <div className="mx-auto max-w-xl">
        
        <header className="mb-8 flex items-center justify-between">
          <button
            onClick={handleAnterior}
            aria-label="Volver atrás"
            className="rounded-full p-2 text-gray-600 transition hover:bg-gray-200"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <h1 className="text-lg font-bold text-[#00334F]">Test de Bienestar Emocional</h1>
          <div className="w-10" aria-hidden="true"></div>
        </header>

        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm font-medium text-gray-600">
            <span>Pregunta {indicePregunta + 1} de {PREGUNTAS.length}</span>
            <span>{Math.round(progreso)}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200" role="progressbar" aria-valuenow={progreso} aria-valuemin="0" aria-valuemax="100">
            <div className="h-full bg-[#0C4A6E] transition-all duration-500 ease-out" style={{ width: `${progreso}%` }}></div>
          </div>
        </div>

        <main className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <fieldset>
            <legend className="mb-6 w-full text-xl font-bold leading-tight text-[#202124]">
              {preguntaActual.texto}
            </legend>

            <div className="space-y-3">
              {preguntaActual.opciones.map((opcion, idx) => {
                const isSelected = respuestas[preguntaActual.id]?.etiqueta === opcion.etiqueta;

                return (
                  <label 
                    key={idx}
                    className={`relative flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all focus-within:ring-4 focus-within:ring-[#0C4A6E] ${
                      isSelected ? "border-[#0C4A6E] bg-[#F0F9FF]" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`pregunta-${preguntaActual.id}`}
                      checked={isSelected}
                      onChange={() => handleSeleccion(opcion)}
                      className="sr-only"
                    />
                    <div className={`mr-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? "border-[#0C4A6E]" : "border-gray-300"}`} aria-hidden="true">
                      {isSelected && <div className="h-3 w-3 rounded-full bg-[#0C4A6E]"></div>}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? "text-[#0C4A6E]" : "text-gray-700"}`}>
                      {opcion.etiqueta}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </main>

        <div className="mt-8">
          <button
            onClick={handleSiguiente}
            disabled={!tieneRespuesta || guardando}
            aria-label="Ver resultados del test"
            className="flex w-full items-center justify-center rounded-xl bg-[#0C4A6E] px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-[#073654] disabled:opacity-50"
          >
            {guardando ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              indicePregunta === PREGUNTAS.length - 1 ? "Ver Resultados" : "Siguiente"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}