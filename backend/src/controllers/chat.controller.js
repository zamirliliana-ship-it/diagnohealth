import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
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
          "Habla en español, con empatía, claridad y respeto. " +
          "No reemplazas a profesionales de salud. " +
          "No diagnostiques enfermedades. " +
          "Si detectas una posible situación de crisis o riesgo inmediato, " +
          "indica que la persona busque ayuda inmediata y utiliza el sistema de alerta de crisis de DiagnoHealth.",
      },

      ...cleanHistory.map((item) => ({
        role: item.sender === "user" ? "user" : "assistant",
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

    return res.status(200).json({
      ok: true,
      message: response.output_text,
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