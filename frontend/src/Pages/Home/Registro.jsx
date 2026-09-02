import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { supabase } from '../../config/supabase';

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;


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
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const CAMPOS_OBLIGATORIOS = [
    { id: 'docType', label: 'Tipo de documento' },
    { id: 'docNumber', label: 'Número de documento' },
    { id: 'firstNames', label: 'Nombres' },
    { id: 'lastNames', label: 'Apellidos' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Teléfono' },
    { id: 'gender', label: 'Sexo' },
    { id: 'password', label: 'Contraseña' },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (fieldErrors[id]) {
      setFieldErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }

    if (errorMensaje) {
      setErrorMensaje('');
    }
  };

  const validarCampos = () => {
    const errores = {};

    CAMPOS_OBLIGATORIOS.forEach(({ id, label }) => {
      if (!formData[id] || !formData[id].toString().trim()) {
        errores[id] = `${label} es obligatorio.`;
      }
    });

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMensaje('');

    const errores = validarCampos();

    if (Object.keys(errores).length > 0) {
      setFieldErrors(errores);
      setErrorMensaje(
        'Todos los campos son obligatorios. Por favor completa la información faltante.'
      );
      return;
    }

    setFieldErrors({});

    if (!PASSWORD_REGEX.test(formData.password)) {
      setFieldErrors({
        password:
          'La contraseña debe tener mínimo 8 caracteres e incluir letras, números y un carácter especial.',
      });

      setErrorMensaje(
        'La contraseña no cumple con los requisitos de seguridad.'
      );

      return;
    }

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
      navigate('/Login');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-gray-800 overflow-x-hidden">

      {/* =========================================================
          DECORACIONES GENERALES
      ========================================================== */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200/30 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-200/20 blur-3xl"
      />

      <div className="min-h-screen flex flex-col lg:flex-row relative z-10">

        {/* =====================================================
            LADO IZQUIERDO
        ====================================================== */}

        <aside className="relative w-full lg:w-[43%] min-h-[560px] lg:min-h-screen flex flex-col justify-between px-6 py-8 md:px-12 lg:px-16">

          {/* LOGO */}

        <img
        src="/imagenes/diagnohealth-logo.png"
        alt="Logo de DIAGNOHEALTH"
        className="w-12 h-12 object-contain"
      />


          {/* CONTENIDO */}

          <div className="flex flex-col justify-center flex-1 max-w-xl mx-auto lg:mx-0 py-10 lg:py-0">




            {/* TITULO */}

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight text-[#0C4A6E]">

              Comienza a cuidar

              <br />

              <span className="bg-gradient-to-r from-[#0369A1] to-[#0C4A6E] bg-clip-text text-transparent">
                tu bienestar.
              </span>

            </h1>


            {/* DESCRIPCIÓN */}

            <p className="mt-6 max-w-md text-base md:text-lg leading-relaxed text-gray-600">

              Crea tu cuenta en DIAGNOHEALTH y descubre un espacio seguro
              para conocer cómo te sientes, encontrar herramientas y cuidar
              tu bienestar emocional.

            </p>


            {/* IMAGEN */}

            <div className="relative mt-8 md:mt-10 flex justify-center lg:justify-start">

              {/* CÍRCULO DECORATIVO */}

              <div
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 lg:left-32 lg:translate-x-0 bottom-4 w-72 h-72 md:w-80 md:h-80 rounded-full bg-sky-100/70"
              />

              {/* CÍRCULO PEQUEÑO */}

              <div
                aria-hidden="true"
                className="absolute top-0 left-8 md:left-16 w-16 h-16 rounded-full bg-[#0369A1]/10"
              />

              {/* CORAZÓN */}

              <div
                aria-hidden="true"
                className="absolute top-8 right-8 md:right-20 z-20 text-[#0369A1] text-3xl animate-bounce"
              >
                ♥
              </div>

              {/* ESTRELLA */}

              <div
                aria-hidden="true"
                className="absolute bottom-10 left-4 md:left-12 z-20 text-sky-400 text-2xl"
              >
                ✦
              </div>


              {/* IMAGEN */}

              <img
                src="/imagenes/imagenes/foto-mental.png"
                alt="Personas brindándose apoyo emocional"
                className="
                  relative
                  z-10
                  w-full
                  max-w-[480px]
                  object-contain
                  drop-shadow-[0_20px_30px_rgba(12,74,110,0.12)]
                "
              />

            </div>


            {/* FRASE */}

            <p className="hidden sm:block mt-2 text-sm text-gray-500">
              Tu bienestar mental es importante.
            </p>

          </div>


          {/* TEXTO INFERIOR */}

          <div className="hidden lg:block pb-4">

            <p className="text-sm text-gray-500">
              Un espacio seguro para ti.
            </p>

          </div>

        </aside>


        {/* =====================================================
            LADO DERECHO - FORMULARIO
        ====================================================== */}

        <main className="w-full lg:w-[57%] flex items-center justify-center px-4 py-8 md:px-10 lg:px-14 xl:px-20">

          <div className="w-full max-w-2xl">

            {/* ATRÁS */}

            <button
              className="
                inline-flex
                items-center
                gap-2
                mb-5
                text-[#0369A1]
                hover:text-[#0C4A6E]
                transition-colors
                group
                rounded-md
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-2
                focus-visible:outline-[#0369A1]
              "
              type="button"
              onClick={() => navigate(-1)}
            >

              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1"
              />

              <span className="text-sm font-medium">
                Atrás
              </span>

            </button>


            {/* ENCABEZADO */}

            <div className="mb-6">

              <h2 className="text-3xl md:text-4xl font-bold text-[#0C4A6E] tracking-tight">
                Crea tu cuenta
              </h2>

              <p className="mt-2 text-gray-600 leading-relaxed">

                Completa tus datos para comenzar tu experiencia en{' '}

                <span className="font-semibold text-[#0369A1]">
                  DIAGNOHEALTH.
                </span>

              </p>

            </div>


            {/* =================================================
                TARJETA DEL FORMULARIO
            ================================================== */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_15px_50px_rgba(12,74,110,0.08)] p-6 md:p-8">

              {/* ERROR GENERAL */}

              {errorMensaje && (

                <div
                  role="alert"
                  className="
                    mb-5
                    rounded-xl
                    border
                    border-red-200
                    bg-red-50
                    p-3.5
                    text-sm
                    text-red-700
                    leading-relaxed
                  "
                >

                  {errorMensaje}

                </div>

              )}


              {/* FORMULARIO */}

              <form
                className="space-y-5"
                onSubmit={handleSubmit}
              >

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">


                  {/* =================================================
                      TIPO DE DOCUMENTO
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="docType"
                    >
                      Tipo de documento
                    </label>

                    <div className="relative">

                      <select
                        className={`
                          w-full
                          px-4
                          py-3
                          bg-gray-50
                          border
                          rounded-xl
                          outline-none
                          text-sm
                          appearance-none
                          transition-all
                          focus:bg-white
                          focus:ring-2
                          focus:ring-sky-100
                          ${
                            fieldErrors.docType
                              ? 'border-red-400'
                              : 'border-gray-200 focus:border-[#0369A1]'
                          }
                        `}
                        id="docType"
                        value={formData.docType}
                        onChange={handleChange}
                      >

                        <option value="">
                          Selecciona una opción
                        </option>

                        <option value="cc">
                          Cédula de Ciudadanía
                        </option>

                        <option value="ce">
                          Cédula de Extranjería
                        </option>

                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                    </div>

                    {fieldErrors.docType && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.docType}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      NUMERO DOCUMENTO
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="docNumber"
                    >
                      Número de documento
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.docNumber
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="docNumber"
                      placeholder="Ej. 123456789"
                      type="text"
                      value={formData.docNumber}
                      onChange={handleChange}
                    />

                    {fieldErrors.docNumber && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.docNumber}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      NOMBRES
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="firstNames"
                    >
                      Nombres
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.firstNames
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="firstNames"
                      placeholder="Tus nombres"
                      type="text"
                      value={formData.firstNames}
                      onChange={handleChange}
                    />

                    {fieldErrors.firstNames && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.firstNames}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      APELLIDOS
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="lastNames"
                    >
                      Apellidos
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.lastNames
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="lastNames"
                      placeholder="Tus apellidos"
                      type="text"
                      value={formData.lastNames}
                      onChange={handleChange}
                    />

                    {fieldErrors.lastNames && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.lastNames}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      EMAIL
                  ================================================== */}

                  <div className="md:col-span-2">

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="email"
                    >
                      Email
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.email
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="email"
                      placeholder="nombre@ejemplo.com"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />

                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.email}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      TELEFONO
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="phone"
                    >
                      Teléfono
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.phone
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="phone"
                      placeholder="300 000 0000"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />

                    {fieldErrors.phone && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.phone}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      SEXO
                  ================================================== */}

                  <div>

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="gender"
                    >
                      Sexo
                    </label>

                    <div className="relative">

                      <select
                        className={`
                          w-full
                          px-4
                          py-3
                          bg-gray-50
                          border
                          rounded-xl
                          outline-none
                          text-sm
                          appearance-none
                          transition-all
                          focus:bg-white
                          focus:ring-2
                          focus:ring-sky-100
                          ${
                            fieldErrors.gender
                              ? 'border-red-400'
                              : 'border-gray-200 focus:border-[#0369A1]'
                          }
                        `}
                        id="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >

                        <option value="">
                          Selecciona una opción
                        </option>

                        <option value="m">
                          Masculino
                        </option>

                        <option value="f">
                          Femenino
                        </option>

                        <option value="o">
                          Otro
                        </option>

                      </select>

                      <ChevronDown
                        size={18}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />

                    </div>

                    {fieldErrors.gender && (
                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.gender}
                      </p>
                    )}

                  </div>


                  {/* =================================================
                      CONTRASEÑA
                  ================================================== */}

                  <div className="md:col-span-2">

                    <label
                      className="block text-sm font-medium text-gray-700 mb-1.5"
                      htmlFor="password"
                    >
                      Contraseña
                    </label>

                    <input
                      className={`
                        w-full
                        px-4
                        py-3
                        bg-gray-50
                        border
                        rounded-xl
                        outline-none
                        text-sm
                        placeholder-gray-400
                        transition-all
                        focus:bg-white
                        focus:ring-2
                        focus:ring-sky-100
                        ${
                          fieldErrors.password
                            ? 'border-red-400'
                            : 'border-gray-200 focus:border-[#0369A1]'
                        }
                      `}
                      id="password"
                      placeholder="Crea una contraseña segura"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    {fieldErrors.password ? (

                      <p className="mt-1 text-xs text-red-600">
                        {fieldErrors.password}
                      </p>

                    ) : (

                      <p className="mt-1.5 text-xs text-gray-500">
                        Mínimo 8 caracteres, con letras, números y un carácter especial.
                      </p>

                    )}

                  </div>

                </div>


                {/* =================================================
                    BOTÓN CREAR CUENTA
                ================================================== */}

                <button
                  className="
                    w-full
                    py-3.5
                    mt-2
                    rounded-xl
                    bg-gradient-to-r
                    from-[#0369A1]
                    to-[#0C4A6E]
                    text-white
                    text-sm
                    font-semibold
                    shadow-md
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    active:scale-[0.98]
                    transition-all
                    disabled:opacity-70
                    disabled:cursor-not-allowed
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-[#0369A1]
                  "
                  type="submit"
                  disabled={loading}
                >

                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}

                </button>

              </form>


              {/* =================================================
                  INICIAR SESIÓN
              ================================================== */}

              <div className="mt-6 pt-5 border-t border-gray-100 text-center">

                <p className="text-sm text-gray-600">

                  ¿Ya tienes una cuenta?{' '}

                  <Link
                    className="text-[#0369A1] font-semibold hover:text-[#0C4A6E] hover:underline transition-colors"
                    to="/Login"
                  >
                    Iniciar sesión
                  </Link>

                </p>

              </div>

            </div>


            {/* FOOTER */}

            <p className="mt-6 text-center text-xs text-gray-400">
              © 2024 DIAGNOHEALTH. Todos los derechos reservados.
            </p>

          </div>

        </main>

      </div>

    </div>
  );
}

export default Registro;