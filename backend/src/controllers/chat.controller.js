import OpenAI from "openai";
import supabaseAdmin from "../config/supabaseAdmin.js";

// ============================================================
// CONFIGURACIÓN OPENAI
// ============================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// PERSONALIDAD DE YAIRA
// ============================================================

const YAIRA_SYSTEM_PROMPT = `
Eres YAIRA IA, la asistente de bienestar emocional de DiagnoHealth.

Tu misión es acompañar emocionalmente a las personas mediante conversaciones cálidas, humanas, empáticas, respetuosas y naturales.

Responde siempre en español.

==================================================
PERSONALIDAD
==================================================

Eres:

- Empática.
- Cercana.
- Amable.
- Tranquila.
- Respetuosa.
- Comprensiva.
- Paciente.
- Natural.

Debes sonar como alguien que realmente está escuchando a la persona.

Nunca debes sonar fría, robótica, mecánica o como una lista automática de consejos.

==================================================
FORMA DE RESPONDER
==================================================

Cuando una persona comparte algo emocional:

1. Primero escucha y reconoce lo que siente.
2. Valida su emoción sin juzgarla.
3. Demuestra comprensión.
4. Después, si es apropiado, ofrece orientación.
5. Puedes terminar con una pregunta amable para continuar la conversación.

Tu prioridad es hacer que la persona se sienta escuchada y comprendida.

==================================================
VALIDACIÓN EMOCIONAL
==================================================

Puedes utilizar expresiones naturales como:

- "Entiendo que eso pueda ser difícil para ti."
- "Tiene sentido que te sientas así."
- "Gracias por confiarme algo tan personal."
- "Lamento que estés pasando por esto."
- "Debe ser muy pesado vivir una situación así."
- "Estoy aquí para escucharte."
- "Lo que sientes es importante."

No repitas siempre las mismas frases.

Varía tu lenguaje para que la conversación sea natural.

==================================================
EVITA MINIMIZAR LOS SENTIMIENTOS
==================================================

Nunca respondas con frases como:

- "No te preocupes."
- "Todo estará bien."
- "Solo tienes que ser positivo."
- "Hay personas que están peor."
- "Eso no es tan grave."

No minimices los sentimientos del usuario.

==================================================
RECOMENDACIONES
==================================================

No des consejos inmediatamente.

Primero intenta comprender la situación.

Cuando ofrezcas recomendaciones:

- Hazlas sencillas.
- Hazlas realistas.
- No des demasiadas recomendaciones.
- Prefiere uno o dos pasos pequeños.
- Adapta las recomendaciones a lo que el usuario está contando.

Puedes sugerir cosas como:

- Respirar lentamente.
- Descansar.
- Hablar con alguien de confianza.
- Escribir lo que siente.
- Tomar una pequeña pausa.
- Alejarse temporalmente de una situación estresante.
- Buscar apoyo profesional cuando sea necesario.

==================================================
PREGUNTAS
==================================================

Puedes hacer preguntas para comprender mejor al usuario.

Ejemplos:

- "¿Quieres contarme un poco más sobre lo que pasó?"
- "¿Desde cuándo te has sentido así?"
- "¿Qué ha sido lo más difícil para ti?"
- "¿Hay algo que haya ocurrido recientemente?"

No conviertas la conversación en un interrogatorio.

Normalmente haz una sola pregunta importante por respuesta.

==================================================
SALUD MENTAL
==================================================

No diagnostiques enfermedades.

Nunca digas:

- "Tienes depresión."
- "Tienes ansiedad clínica."
- "Tienes un trastorno."

Puedes decir:

- "Lo que describes parece estar generándote mucho malestar."
- "Podría ser útil hablar con un profesional para comprender mejor lo que estás experimentando."

YAIRA ofrece acompañamiento emocional general.

No reemplazas a psicólogos, médicos u otros profesionales de salud.

==================================================
CRISIS Y SEGURIDAD
==================================================

Si el usuario expresa:

- Deseos de morir.
- Intención de suicidarse.
- Deseos de hacerse daño.
- Planes para hacerse daño.
- Peligro inmediato.

Debes priorizar inmediatamente su seguridad.

Debes:

1. Mostrar preocupación genuina.
2. Decir que su seguridad es importante.
3. Recomendar buscar ayuda inmediata.
4. Recomendar contactar los servicios de emergencia locales.
5. Recomendar acudir a una persona de confianza que pueda acompañarle físicamente.
6. Recomendar utilizar la opción de ayuda de emergencia disponible en DiagnoHealth.
7. Preguntar si se encuentra en peligro inmediato cuando sea apropiado.

Nunca ignores una posible situación de crisis.

==================================================
LONGITUD
==================================================

Responde normalmente de forma breve o moderada.

No escribas textos demasiado largos salvo que el usuario necesite una explicación detallada.

==================================================
OBJETIVO
==================================================

Haz que la persona sienta que está hablando con alguien cálido y atento.

Escucha.
Comprende.
Valida.
Acompaña.
Después orienta.
`;

// ============================================================
// CHAT CON YAIRA
// ============================================================

export const chat = async (req, res) => {
  try {
    const {
      message,
      history = [],
      conversacionId,
    } = req.body;

    // ==========================================================
    // VALIDAR MENSAJE
    // ==========================================================

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        ok: false,
        message: "El mensaje es obligatorio.",
      });
    }

    // ==========================================================
    // VALIDAR USUARIO
    // ==========================================================

    const usuarioId = req.user?.id;

    if (!usuarioId) {
      return res.status(401).json({
        ok: false,
        message: "Usuario no autenticado.",
      });
    }

    let conversacionActualId = conversacionId;

    // ==========================================================
    // CREAR NUEVA CONVERSACIÓN
    // ==========================================================

    if (!conversacionActualId) {
      const texto = message.trim();

      const titulo =
        texto.length > 50
          ? `${texto.substring(0, 50)}...`
          : texto;

      const {
        data: nuevaConversacion,
        error: conversacionError,
      } = await supabaseAdmin
        .from("conversaciones")
        .insert({
          usuario_id: usuarioId,
          titulo,
        })
        .select()
        .single();

      if (conversacionError) {
        console.error(
          "Error creando conversación:",
          conversacionError
        );

        throw new Error(
          "No fue posible crear la conversación."
        );
      }

      conversacionActualId =
        nuevaConversacion.id;

    } else {

      // ========================================================
      // VERIFICAR PROPIETARIO DE LA CONVERSACIÓN
      // ========================================================

      const {
        data: conversacion,
        error: verificarError,
      } = await supabaseAdmin
        .from("conversaciones")
        .select("id, usuario_id")
        .eq("id", conversacionActualId)
        .eq("usuario_id", usuarioId)
        .single();

      if (verificarError || !conversacion) {
        return res.status(403).json({
          ok: false,
          message:
            "No tienes permiso para acceder a esta conversación.",
        });
      }
    }

    // ==========================================================
    // GUARDAR MENSAJE DEL USUARIO
    // ==========================================================

    const {
      error: mensajeUsuarioError,
    } = await supabaseAdmin
      .from("mensajes")
      .insert({
        conversacion_id: conversacionActualId,
        remitente: "usuario",
        contenido: message.trim(),
      });

    if (mensajeUsuarioError) {
      console.error(
        "Error guardando mensaje del usuario:",
        mensajeUsuarioError
      );

      throw new Error(
        "No fue posible guardar el mensaje."
      );
    }

    // ==========================================================
    // LIMPIAR HISTORIAL RECIBIDO
    // ==========================================================

    const cleanHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              typeof item.text === "string" &&
              item.text.trim() &&
              (
                item.sender === "user" ||
                item.sender === "ai"
              )
          )
          .slice(-12)
      : [];

    // ==========================================================
    // PREPARAR CONTEXTO PARA OPENAI
    // ==========================================================

    const input = [
      {
        role: "system",
        content: YAIRA_SYSTEM_PROMPT,
      },

      ...cleanHistory.map((item) => ({
        role:
          item.sender === "user"
            ? "user"
            : "assistant",

        content: item.text.trim(),
      })),

      {
        role: "user",
        content: message.trim(),
      },
    ];

    // ==========================================================
    // CONSULTAR OPENAI
    // ==========================================================

    console.log("YAIRA está procesando el mensaje...");

    const response =
      await openai.responses.create({
        model:
          process.env.OPENAI_MODEL ||
          "gpt-5.4",

        input,
      });

    const answer =
      response.output_text?.trim() ||
      "Estoy aquí contigo. ¿Quieres contarme un poco más sobre cómo te estás sintiendo?";

    // ==========================================================
    // GUARDAR RESPUESTA DE YAIRA
    // ==========================================================

    const {
      error: mensajeChatbotError,
    } = await supabaseAdmin
      .from("mensajes")
      .insert({
        conversacion_id: conversacionActualId,
        remitente: "chatbot",
        contenido: answer,
      });

    if (mensajeChatbotError) {
      console.error(
        "Error guardando respuesta de YAIRA:",
        mensajeChatbotError
      );

      throw new Error(
        "YAIRA respondió, pero no fue posible guardar su mensaje."
      );
    }

    // ==========================================================
    // ACTUALIZAR FECHA DE CONVERSACIÓN
    // ==========================================================

    const {
      error: actualizarError,
    } = await supabaseAdmin
      .from("conversaciones")
      .update({
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", conversacionActualId);

    if (actualizarError) {
      console.error(
        "Error actualizando conversación:",
        actualizarError
      );
    }

    // ==========================================================
    // RESPUESTA AL FRONTEND
    // ==========================================================

    return res.status(200).json({
      ok: true,

      message: answer,

      conversacionId:
        conversacionActualId,
    });

  } catch (error) {

    console.error("=================================");
    console.error("ERROR EN CHATBOT");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      ok: false,

      message:
        error.message ||
        "No fue posible obtener una respuesta de YAIRA.",
    });
  }
};

// ============================================================
// OBTENER TODAS LAS CONVERSACIONES
// ============================================================

export const getConversaciones =
  async (req, res) => {

    try {
      const usuarioId = req.user?.id;

      if (!usuarioId) {
        return res.status(401).json({
          ok: false,
          message:
            "Usuario no autenticado.",
        });
      }

      const {
        data: conversaciones,
        error,
      } = await supabaseAdmin
        .from("conversaciones")
        .select(`
          id,
          titulo,
          created_at,
          updated_at
        `)
        .eq(
          "usuario_id",
          usuarioId
        )
        .order(
          "updated_at",
          {
            ascending: false,
          }
        );

      if (error) {
        console.error(
          "Error obteniendo conversaciones:",
          error
        );

        throw new Error(
          "No fue posible obtener las conversaciones."
        );
      }

      return res.status(200).json({
        ok: true,

        conversaciones:
          conversaciones || [],
      });

    } catch (error) {

      console.error(
        "Error en getConversaciones:",
        error
      );

      return res.status(500).json({
        ok: false,

        message:
          "No fue posible cargar las conversaciones.",
      });
    }
  };

// ============================================================
// OBTENER UNA CONVERSACIÓN Y SUS MENSAJES
// ============================================================

export const getConversacionById =
  async (req, res) => {

    try {
      const usuarioId = req.user?.id;

      const conversacionId =
        req.params.id;

      if (!usuarioId) {
        return res.status(401).json({
          ok: false,
          message:
            "Usuario no autenticado.",
        });
      }

      // ========================================================
      // VERIFICAR PROPIETARIO
      // ========================================================

      const {
        data: conversacion,
        error: conversacionError,
      } = await supabaseAdmin
        .from("conversaciones")
        .select(`
          id,
          titulo,
          usuario_id,
          created_at,
          updated_at
        `)
        .eq("id", conversacionId)
        .eq("usuario_id", usuarioId)
        .single();

      if (
        conversacionError ||
        !conversacion
      ) {
        return res.status(404).json({
          ok: false,

          message:
            "La conversación no existe o no tienes permiso.",
        });
      }

      // ========================================================
      // OBTENER MENSAJES
      // ========================================================

      const {
        data: mensajes,
        error: mensajesError,
      } = await supabaseAdmin
        .from("mensajes")
        .select(`
          id,
          remitente,
          contenido,
          created_at
        `)
        .eq(
          "conversacion_id",
          conversacionId
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

      if (mensajesError) {
        console.error(
          "Error obteniendo mensajes:",
          mensajesError
        );

        throw new Error(
          "No fue posible obtener los mensajes."
        );
      }

      return res.status(200).json({
        ok: true,

        conversacion,

        mensajes:
          mensajes || [],
      });

    } catch (error) {

      console.error(
        "Error en getConversacionById:",
        error
      );

      return res.status(500).json({
        ok: false,

        message:
          "No fue posible cargar la conversación.",
      });
    }
  };

// ============================================================
// ELIMINAR CONVERSACIÓN
// ============================================================

export const deleteConversacion =
  async (req, res) => {

    try {
      const usuarioId = req.user?.id;

      const conversacionId =
        req.params.id;

      if (!usuarioId) {
        return res.status(401).json({
          ok: false,

          message:
            "Usuario no autenticado.",
        });
      }

      // ========================================================
      // VERIFICAR QUE PERTENECE AL USUARIO
      // ========================================================

      const {
        data: conversacion,
        error: buscarError,
      } = await supabaseAdmin
        .from("conversaciones")
        .select("id")
        .eq("id", conversacionId)
        .eq("usuario_id", usuarioId)
        .single();

      if (
        buscarError ||
        !conversacion
      ) {
        return res.status(404).json({
          ok: false,

          message:
            "La conversación no existe o no tienes permiso.",
        });
      }

      // ========================================================
      // ELIMINAR CONVERSACIÓN
      // Los mensajes se eliminan automáticamente por ON DELETE CASCADE
      // ========================================================

      const {
        error: eliminarError,
      } = await supabaseAdmin
        .from("conversaciones")
        .delete()
        .eq("id", conversacionId)
        .eq("usuario_id", usuarioId);

      if (eliminarError) {
        console.error(
          "Error eliminando conversación:",
          eliminarError
        );

        throw new Error(
          "No fue posible eliminar la conversación."
        );
      }

      return res.status(200).json({
        ok: true,

        message:
          "Conversación eliminada correctamente.",
      });

    } catch (error) {

      console.error(
        "Error en deleteConversacion:",
        error
      );

      return res.status(500).json({
        ok: false,

        message:
          "No fue posible eliminar la conversación.",
      });
    }
  };