import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 3000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "1mb",
  })
);

app.get("/", (req, res) => {
  return res.status(200).json({
    ok: true,
    message:
      "La API de DiagnoHealth está funcionando correctamente.",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  (req, res) => {
    return res.status(404).json({
      ok: false,
      message: "Ruta no encontrada.",
    });
  }
);

app.use(
  (err, req, res) => {
    console.error(
      "Error interno del servidor:",
      err
    );

    return res.status(500).json({
      ok: false,
      message:
        "Error interno del servidor.",
    });
  }
);

app.listen(PORT, () => {
  console.log(
    `Servidor de DiagnoHealth corriendo en http://localhost:${PORT}`
  );
});