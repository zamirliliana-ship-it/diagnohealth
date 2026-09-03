import OpenAI from "openai";
import supabaseAdmin from "../config/supabaseAdmin.js";

// ============================================================
// CONFIGURACIÓN OPENAI
// ============================================================

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ============================================================
// CHAT CON DIAGNOHEALTH
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
        content:
          "Eres Diagnohealth IA, el asistente de bienestar emocional de DiagnoHealth. " +
          "Responde siempre en español con un estilo natural, cercano y humano. " +
          "Conversa de forma cálida y sencilla, como alguien que realmente está escuchando. " +
          "Evita sonar como un robot, un manual, una página web o un texto generado automáticamente. " +
          "Utiliza palabras cotidianas y frases naturales. " +
          "Sé empática sin exagerar ni utilizar expresiones demasiado formales. " +
          "Mantén un tono tranquilo, respetuoso y coherente durante toda la conversación. " +
          "Adapta la respuesta a lo que la persona acaba de decir y evita respuestas genéricas. " +
          "No repitas innecesariamente las mismas frases o estructuras. " +
          "No repitas la pregunta del usuario antes de responder. " +
          "Evita comenzar constantemente con frases como 'Entiendo cómo te sientes' o 'Lamento que estés pasando por esto'. " +
          "Varía naturalmente tus expresiones según el contexto. " +
          "Responde de forma breve y directa cuando la situación no requiera una explicación extensa. " +
          "Prioriza respuestas de pocas frases y párrafos cortos. " +
          "Evita los bloques largos de texto y las listas extensas, salvo que sean realmente necesarias. " +
          "Si una respuesta puede darse de manera sencilla, no la hagas más larga de lo necesario. " +
          "Cuando sea apropiado, termina con una pregunta breve que permita continuar la conversación, pero no hagas preguntas innecesarias. " +
          "No diagnostiques enfermedades. " +
          "No afirmes que sustituyes a un psicólogo, médico u otro profesional. " +
          "No inventes información personal del usuario. " +
          "Si la persona expresa señales de una posible crisis, riesgo de hacerse daño, " +
          "intención suicida o peligro inmediato, prioriza su seguridad, recomienda " +
          "buscar ayuda inmediata y señala que puede utilizar la opción de ayuda de DiagnoHealth.",
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

    console.log("DIAGNOHEALTH está procesando el mensaje...");

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
    // GUARDAR RESPUESTA DE DIAGNOHEALTH
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
        "Error guardando respuesta de DIAGNOHEALTH:",
        mensajeChatbotError
      );

      throw new Error(
        "DIAGNOHEALTH respondió, pero no fue posible guardar su mensaje."
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
        "No fue posible obtener una respuesta de DIAGNOHEALTH.",
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