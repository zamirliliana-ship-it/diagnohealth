import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, UserPlus, Home } from 'lucide-react';
import { supabase } from '../../config/supabase';

const PREGUNTAS = [
  {
    id: 1,
    texto: "Durante la última semana, ¿con qué frecuencia te has sentido decaído o deprimido?",
    opciones: [
      { valor: 0, etiqueta: "Ningún día" },
      { valor: 1, etiqueta: "Varios días" },
      { valor: 2, etiqueta: "Más de la mitad de los días" },
      { valor: 3, etiqueta: "Casi todos los días" }
    ]
  },
  {
    id: 2,
    texto: "¿Has sentido poco interés o placer en hacer cosas que normalmente disfrutas?",
    opciones: [
      { valor: 0, etiqueta: "Ningún día" },
      { valor: 1, etiqueta: "Varios días" },
      { valor: 2, etiqueta: "Más de la mitad de los días" },
      { valor: 3, etiqueta: "Casi todos los días" }
    ]
  }
];

export default function TestBienestar() {
  const navigate = useNavigate();
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [testCompletado, setTestCompletado] = useState(false);
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

  const handleSeleccion = (valor) => {
    setRespuestas({ ...respuestas, [preguntaActual.id]: valor });
  };

  const handleSiguiente = async () => {
    if (indicePregunta < PREGUNTAS.length - 1) {
      setIndicePregunta(indicePregunta + 1);
    } else {
      setGuardando(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setEsInvitado(false);
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
      navigate(esInvitado ? '/' : '/inicioS');
    }
  };

  if (testCompletado) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF7F2] p-4 text-center">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl" role="alert" aria-live="assertive">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 size={40} aria-hidden="true" />
          </div>
          <h2 className="text-2xl font-bold text-[#00334F]">¡Test completado!</h2>
          
          {esInvitado ? (
            <div className="mt-4">
              <p className="mb-6 text-gray-600">
                Has dado un gran paso. Para guardar tu historial y recibir un seguimiento personalizado, crea una cuenta gratuita.
              </p>
              <button onClick={() => navigate('/registro')} className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] py-4 font-bold text-white transition hover:bg-[#073654]">
                <UserPlus size={20} /> Crear mi cuenta
              </button>
              <button onClick={() => navigate('/')} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white py-4 font-bold text-gray-600 transition hover:bg-gray-50">
                <Home size={20} /> Volver al inicio
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <p className="mb-6 text-gray-600">Tus respuestas han sido guardadas de forma segura en tu historial médico.</p>
              <button onClick={() => navigate('/inicioS')} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4A6E] py-4 font-bold text-white transition hover:bg-[#073654]">
                <Home size={20} /> Volver a mi panel
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
          <button onClick={handleAnterior} aria-label="Volver atrás" className="rounded-full p-2 text-gray-600 transition hover:bg-gray-200">
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <h1 className="text-lg font-bold text-[#00334F]">Evaluación DiagnoHealth</h1>
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
            <legend className="mb-6 w-full text-xl font-bold leading-tight text-[#202124]">{preguntaActual.texto}</legend>
            <div className="space-y-3">
              {preguntaActual.opciones.map((opcion) => {
                const isSelected = respuestas[preguntaActual.id] === opcion.valor;
                return (
                  <label key={opcion.valor} className={`relative flex cursor-pointer items-center rounded-xl border-2 p-4 transition-all focus-within:ring-4 focus-within:ring-[#0C4A6E] ${isSelected ? "border-[#0C4A6E] bg-[#F0F9FF]" : "border-gray-200 hover:bg-gray-50"}`}>
                    <input type="radio" name={`pregunta-${preguntaActual.id}`} value={opcion.valor} checked={isSelected} onChange={() => handleSeleccion(opcion.valor)} className="sr-only" />
                    <div className={`mr-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${isSelected ? "border-[#0C4A6E]" : "border-gray-300"}`} aria-hidden="true">
                      {isSelected && <div className="h-3 w-3 rounded-full bg-[#0C4A6E]"></div>}
                    </div>
                    <span className={`text-base font-medium ${isSelected ? "text-[#0C4A6E]" : "text-gray-700"}`}>{opcion.etiqueta}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>
        </main>

        <div className="mt-8">
          <button onClick={handleSiguiente} disabled={!tieneRespuesta || guardando} className="flex w-full items-center justify-center rounded-xl bg-[#0C4A6E] px-4 py-4 text-lg font-bold text-white shadow-md transition-all hover:bg-[#073654] disabled:opacity-50">
            {indicePregunta === PREGUNTAS.length - 1 ? "Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}