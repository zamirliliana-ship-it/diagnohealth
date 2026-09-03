import { Router } from "express";

import {
  chat,
  getConversaciones,
  getConversacionById,
  deleteConversacion,
} from "../controllers/chat.controller.js";

import {
  requireAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

// ============================================================
// ENVIAR MENSAJE A YAIRA
// ============================================================

router.post(
  "/",
  requireAuth,
  chat
);

// ============================================================
// OBTENER TODAS LAS CONVERSACIONES DEL USUARIO
// ============================================================

router.get(
  "/conversaciones",
  requireAuth,
  getConversaciones
);

// ============================================================
// OBTENER UNA CONVERSACIÓN CON SUS MENSAJES
// ============================================================

router.get(
  "/conversaciones/:id",
  requireAuth,
  getConversacionById
);

// ============================================================
// ELIMINAR UNA CONVERSACIÓN
// ============================================================

router.delete(
  "/conversaciones/:id",
  requireAuth,
  deleteConversacion
);

export default router;