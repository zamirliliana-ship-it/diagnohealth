import { Router } from "express";

import {
  register,
  me,
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

router.get(
  "/me",
  requireAuth,
  me
);

export default router;