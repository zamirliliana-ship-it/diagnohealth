import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        ok: false,
        message: "El mensaje es obligatorio.",
      });
    }

    const cleanHistory = Array.isArray(history)
      ? history
          .filter(
            (item) =>
              item &&
              typeof item.text === "string" &&
              (item.sender === "user" ||
                item.sender === "ai")
          )
          .slice(-12)
      : [];

    const input = [
      {
        role: "system",
        content:
          "Eres YAIRA IA, el asistente de bienestar emocional de DiagnoHealth. " +
          "Responde siempre en español. " +
          "Sé empática, clara, respetuosa y breve. " +
          "Escucha primero y evita respuestas frías o robóticas. " +
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
        content: item.text,
      })),

      {
        role: "user",
        content: message.trim(),
      },
    ];

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4",
      input,
    });

    const answer =
      response.output_text?.trim() ||
      "No pude generar una respuesta en este momento.";

    return res.status(200).json({
      ok: true,
      message: answer,
    });
  } catch (error) {
    console.error("Error en chatbot:", error);

    return res.status(500).json({
      ok: false,
      message:
        "No fue posible obtener una respuesta del asistente.",
    });
  }
};