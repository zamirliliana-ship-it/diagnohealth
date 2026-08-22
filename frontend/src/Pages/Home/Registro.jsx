import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, ArrowLeft, ChevronDown } from 'lucide-react';
import { supabase } from '../../config/supabase';

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    docType: '',
    docNumber: '',
    firstNames: '',
    lastNames: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
  });

  const [errorMensaje, setErrorMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMensaje('');
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          tipo_documento: formData.docType,
          numero_documento: formData.docNumber,
          nombres: formData.firstNames,
          apellidos: formData.lastNames,
          telefono: formData.phone,
          genero: formData.gender,
        },
      },
    });

    if (error) {
      setErrorMensaje(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      navigate('/inicioS');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 overflow-x-hidden">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side: Illustration & Branding (Fixed on Desktop) */}
        <aside className="relative w-full lg:w-1/2 bg-[#0369A1] flex flex-col items-center justify-center p-8 md:p-16 overflow-hidden">
          <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-3 z-20">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Brain className="text-[#0369A1]" size={24} />
            </div>
            <h1 className="text-xl text-white tracking-tight font-bold hidden sm:block">DIAGNOHEALTH</h1>
          </div>
          <div className="relative w-full max-w-lg mt-12 lg:mt-0">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-sky-300 opacity-20 blur-[100px] rounded-full"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#0C4A6E] opacity-30 blur-[100px] rounded-full"></div>
            <img
              alt="Mental health support illustration"
              className="relative z-10 w-full max-h-[500px] h-auto drop-shadow-2xl rounded-2xl object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7TBUzk9Ka5lLOjXDyrStAp3PzdL0PK4k1mqYA_azMYwqO1xC9jxlGb1TLp_KxJAjaAwnfg_uY4pJ5jcZqpftEMpZRtZKZaYM9es6iQkYHymX8f4isuOWCWZJZwkxy1J9VWc_r_ZpESuZ_r51Taouo6SqCYmoVmqCfhYGAFgUkP4UaRH_sWrDVIzy_jsw7C57wFF9zeO7nDqymoBi5tNIWdIYVGiHpxsSztUz-r7t3gs-zhRWJ6KzuGT4TVURqo0-RoJp0QToowWA"
            />
          </div>
          <div className="mt-12 text-center lg:text-left max-w-md relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Tu bienestar mental, nuestra prioridad.</h2>
            <p className="text-sky-50 opacity-90">Únete a nuestra plataforma diseñada para el cuidado humano y profesional de tu salud mental.</p>
          </div>
        </aside>

        {/* Right Side: Registration Form */}
        <main className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-gray-50">
          <div className="w-full max-w-xl">
            {/* Back Navigation */}
            <button
              className="inline-flex items-center gap-2 text-[#0369A1] hover:text-[#0C4A6E] transition-colors mb-8 group"
              type="button"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
              <span className="text-sm font-medium">Atrás</span>
            </button>

            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2">Crea tu cuenta</h2>
              <p className="text-gray-600">Completa los datos a continuación para comenzar tu proceso.</p>
            </div>

            {/* Registration Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 md:p-10">
              {errorMensaje && (
                <div role="alert" className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {errorMensaje}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Tipo de documento */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="docType">Tipo de documento</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 appearance-none"
                        id="docType"
                        value={formData.docType}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="cc">Cédula de Ciudadanía</option>
                        <option value="ce">Cédula de Extranjería</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Numero de documento */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="docNumber">Número de documento</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="docNumber"
                      placeholder="Ej. 123456789"
                      type="text"
                      value={formData.docNumber}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Nombres */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="firstNames">Nombres</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="firstNames"
                      placeholder="Tus nombres"
                      type="text"
                      value={formData.firstNames}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Apellidos */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="lastNames">Apellidos</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="lastNames"
                      placeholder="Tus apellidos"
                      type="text"
                      value={formData.lastNames}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Email (Full width on md+) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="email">Email</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="email"
                      placeholder="nombre@ejemplo.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Teléfono */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="phone">Teléfono</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="phone"
                      placeholder="300 000 0000"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Sexo */}
                  <div>
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="gender">Sexo</label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 appearance-none"
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Selecciona una opción</option>
                        <option value="m">Masculino</option>
                        <option value="f">Femenino</option>
                        <option value="o">Otro</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Contraseña (Full width on md+) */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#0369A1] mb-2" htmlFor="password">Contraseña</label>
                    <input
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-200 focus:border-[#0369A1] outline-none text-sm text-gray-800 placeholder-gray-300"
                      id="password"
                      placeholder="Crea una contraseña segura"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  className="w-full py-4 bg-[#0369A1] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A6E] transition-all transform active:scale-[0.98] shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link className="text-[#0369A1] font-semibold hover:underline" to="/inicioS">Iniciar sesión</Link>
                </p>
              </div>
            </div>

            {/* Simple Footer */}
            <footer className="mt-12 text-center lg:text-left">
              <p className="text-xs text-gray-400">© 2024 DIAGNOHEALTH. Todos los derechos reservados.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Registro;