import { useEffect, useState } from "react";
import {
  Plus,
  ClipboardCheck,
  Smile,
  Sparkles,
  Calendar,
  ChevronRight,
  Download,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { supabase } from "../../config/supabase";
import DashboardSidebar from "../../components/layout/DashboardSidebar";

const STATUS_STYLES = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  red: "bg-red-100 text-red-800",
};

const STATUS_DOT = {
  green: "bg-green-600",
  yellow: "bg-yellow-600",
  red: "bg-red-600",
};

const BAR_SCORE = {
  green: 3,
  yellow: 2,
  red: 1,
};

const BAR_COLOR = {
  green: "#16A34A",
  yellow: "#CA8A04",
  red: "#DC2626",
};

function MiProgreso() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [historialTests, setHistorialTests] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estadísticas reales basadas en los datos del usuario
  const [estadisticas, setEstadisticas] = useState({
    totalTests: 0,
    ultimoEstado: null,
    ultimoColor: null,
    ultimoTitulo: null,
    ultimaFecha: null,
  });

  useEffect(() => {
    let mounted = true;

    const loadRealData = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error obteniendo usuario:", userError);
          return;
        }

        if (mounted) {
          setUser(user);

          const { data: testData, error: testError } = await supabase
            .from('resultados_test')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

          if (!testError && testData) {
            const historialMapeado = testData.map((item) => {
              const esBienestar = item.emocion_predominante.toLowerCase().includes("bienestar") || item.emocion_predominante.toLowerCase().includes("estabilidad");
              const esAlerta = item.emocion_predominante.toLowerCase().includes("ansiedad") || item.emocion_predominante.toLowerCase().includes("tristeza");

              return {
                id: item.id,
                rawDate: item.created_at,
                date: new Date(item.created_at).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }),
                title: item.emocion_predominante,
                detalle: item.detalle,
                status: esBienestar ? "Estable" : esAlerta ? "Atención requerida" : "Moderado",
                color: esBienestar ? "green" : esAlerta ? "red" : "yellow",
              };
            });

            setHistorialTests(historialMapeado);

            setEstadisticas({
              totalTests: testData.length,
              ultimoEstado: historialMapeado[0]?.status || null,
              ultimoColor: historialMapeado[0]?.color || null,
              ultimoTitulo: historialMapeado[0]?.title || null,
              ultimaFecha: historialMapeado[0]?.date || null,
            });
          }
        }
      } catch (err) {
        console.error("Error al conectar con Supabase:", err);
      } finally {
        if (mounted) {
          setCargando(false);
        }
      }
    };

    loadRealData();

    return () => {
      mounted = false;
    };
  }, []);

  // Datos para la gráfica: del más antiguo al más reciente, máximo 10 puntos
  const chartData = [...historialTests].slice(0, 10).reverse();

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1B1C1A]">
      <DashboardSidebar userLabel={user?.email} />

      <main className="ml-0 flex min-h-screen flex-col pb-20 md:ml-64 md:pb-0">
        <div className="mx-auto w-full max-w-[1100px] flex-1 space-y-8 px-4 py-6 pl-16 sm:px-6 md:pl-6 md:py-10">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0C4A6E] sm:text-3xl">
                Mi progreso emocional
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Visualiza tu evolución y mantén tus hábitos saludables.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/test-bienestar')}
              className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#0369A1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0C4A6E]"
            >
              <Plus size={18} />
              Nuevo test
            </button>
          </header>

          {/* =====================================================
              ESTADÍSTICAS (2 tarjetas, datos reales)
          ===================================================== */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#CBE6FF] text-[#0C4A6E]">
                <ClipboardCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Evaluaciones registradas</p>
                <p className="text-lg font-bold text-[#0C4A6E]">
                  {estadisticas.totalTests}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    {estadisticas.totalTests === 1 ? "test" : "tests"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#CDE5FF] text-[#0369A1]">
                <Smile size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Diagnóstico actual</p>
                {estadisticas.ultimoTitulo ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-lg font-bold text-[#0C4A6E]">
                      {estadisticas.ultimoTitulo}
                    </p>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_STYLES[estadisticas.ultimoColor]
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[estadisticas.ultimoColor]}`} />
                      {estadisticas.ultimoEstado}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-gray-400">Sin registros</p>
                )}
              </div>
            </div>

          </section>

          {/* =====================================================
              EVOLUCIÓN DE BIENESTAR (resumen minimalista)
          ===================================================== */}
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">

            <div className="mb-6 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#CBE6FF] text-[#0C4A6E]">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#0C4A6E] sm:text-xl">
                  Evolución de bienestar
                </h2>
                <p className="text-xs text-gray-500">
                  Tu estado emocional en el tiempo, sin números excesivos.
                </p>
              </div>
            </div>

            {historialTests.length === 0 ? (
              <div className="flex h-48 w-full flex-col items-center justify-center text-center">
                <p className="mb-2 text-sm text-gray-400">Aún no hay suficientes datos para graficar.</p>
                <p className="text-xs text-gray-400">Completa tu primer test de bienestar para activar las métricas.</p>
              </div>
            ) : (
              <>
                {/* Resultado más reciente, sin degradados ni emojis */}
                <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-100 bg-[#FAFAF8] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#CBE6FF] text-[#0C4A6E]">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0C4A6E]">
                        {estadisticas.ultimoTitulo}
                      </p>
                      <p className="text-xs text-gray-500">{estadisticas.ultimaFecha}</p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[estadisticas.ultimoColor]
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT[estadisticas.ultimoColor]}`} />
                    {estadisticas.ultimoEstado}
                  </span>
                </div>

                {/* Gráfica de barras con datos reales */}
                <div className="mb-3 flex h-48 items-end justify-between gap-2 border-b border-gray-100 px-1">
                  {chartData.map((item) => {
                    const score = BAR_SCORE[item.color] ?? 2;

                    return (
                      <div
                        key={item.id}
                        className="group relative flex h-full w-full flex-col items-center justify-end"
                      >
                        <div className="pointer-events-none absolute -top-8 z-10 hidden max-w-[160px] whitespace-normal rounded-lg bg-[#0C4A6E] px-2.5 py-1.5 text-center text-[10px] leading-tight text-white shadow-lg group-hover:block">
                          {item.title} · {item.status}
                        </div>

                        <div
                          className="w-full max-w-[36px] rounded-t-md transition-all duration-300"
                          style={{
                            height: `${(score / 3) * 100}%`,
                            backgroundColor: BAR_COLOR[item.color],
                          }}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between gap-2 px-1 text-[10px] uppercase text-gray-400">
                  {chartData.map((item) => (
                    <span key={item.id} className="w-full truncate text-center">
                      {item.date}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                    Estable
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-yellow-600" />
                    Moderado
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-600" />
                    Atención requerida
                  </span>
                </div>
              </>
            )}
          </section>

          {/* =====================================================
              HISTORIAL DE RESULTADOS
          ===================================================== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#0C4A6E] sm:text-xl">
                Historial de resultados
              </h2>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 text-sm font-semibold text-[#0369A1] hover:text-[#0C4A6E]"
              >
                Descargar reporte <Download size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {cargando ? (
                <p className="py-6 text-center text-sm text-gray-500">Cargando historial en tiempo real...</p>
              ) : historialTests.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
                  <p className="mb-1 text-sm font-semibold text-gray-700">No hay evaluaciones registradas todavía.</p>
                  <p className="mb-4 text-xs text-gray-500">Tu historial aparecerá aquí en cuanto completes tu primer test.</p>
                  <button
                    onClick={() => navigate('/test-bienestar')}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0369A1] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0C4A6E]"
                  >
                    Realizar test de bienestar ahora
                  </button>
                </div>
              ) : (
                historialTests.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 transition hover:bg-gray-50 md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-[#CBE6FF] p-3 text-[#0C4A6E]">
                        <Calendar size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-[#0C4A6E]">{item.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{item.date} • {item.detalle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                          STATUS_STYLES[item.color]
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${STATUS_DOT[item.color]}`} />
                        {item.status}
                      </span>

                      <span className="hidden items-center text-xs font-bold text-[#0369A1] sm:flex">
                        Registrado <ChevronRight size={16} />
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ===================================================== */}
          <footer className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-center md:flex-row md:text-left">
            <p className="text-xs text-gray-400">
              © 2026 DIAGNOHEALTH. Todos los derechos reservados.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">Privacidad</a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">Términos</a>
              <a href="#" className="text-xs text-gray-400 hover:text-[#0369A1]">Ayuda</a>
            </div>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default MiProgreso;