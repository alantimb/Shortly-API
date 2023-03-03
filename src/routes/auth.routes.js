import { Router } from "express";
import { createUser, signIn, userData } from "../controllers/auth.controllers.js";
import {
  authRoutesValidation,
  signInSchemaValidation,
  userSchemaValidation,
} from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/signup", userSchemaValidation, createUser);
router.post("/signin", signInSchemaValidation, signIn);
router.get("/users/me", authRoutesValidation, userData);

export default router;
