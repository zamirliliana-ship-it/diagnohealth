import { Router } from "express";

import {
  register,
  login,
  me,
  recuperarPassword,
  restablecerPassword,
} from "../controllers/auth.controller.js";

import {
  validateRegister,
} from "../middlewares/validator.js";

import {
  requireAuth,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  validateRegister,
  register
);

router.post(
  "/login",
  login
);

router.get(
  "/me",
  requireAuth,
  me
);

router.post(
  "/recuperar-password",
  recuperarPassword
);

router.post(
  "/restablecer-password",
  restablecerPassword
);

export default router;