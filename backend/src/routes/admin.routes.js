import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { sourcesController } from "../controllers/admin.controller.js"; // <-- Importa también tu controlador de fuentes

const router = Router();

// Rutas de usuarios / pacientes
router.get("/", adminController.getUsers);
router.post("/", adminController.createUser);
router.put("/:id", adminController.updateUser);
router.delete("/:id", adminController.deleteUser);

// NUEVAS: Rutas para la gestión de fuentes (coinciden con el fetch del frontend)
router.get("/sources", sourcesController.getSources);
router.post("/sources", sourcesController.addSource);
router.delete("/sources/:id", sourcesController.deleteSource);

export default router;
