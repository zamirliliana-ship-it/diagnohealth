import { Router } from "express";
import {
  adminController,
  sourcesController,
} from "../controllers/admin.controller.js";

const router = Router();

// Rutas de autenticación para administradores
router.post("/register", adminController.registerAdmin);
router.post("/login", adminController.loginAdmin);

// 🆕 Ruta para enviar invitación por correo a nuevos administradores
router.post("/invite", adminController.inviteAdmin);

// Rutas de usuarios / pacientes
router.get("/", adminController.getUsers);
router.post("/", adminController.createUser);
router.put("/:id", adminController.updateUser);
router.delete("/:id", adminController.deleteUser);

// Rutas para la gestión de fuentes
router.get("/sources", sourcesController.getSources);
router.post("/sources", sourcesController.addSource);
router.delete("/sources/:id", sourcesController.deleteSource);

export default router;
