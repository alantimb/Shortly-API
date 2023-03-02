import { Router } from "express";
import { createUser, signIn } from "../controllers/auth.controllers.js";
import {
  signInSchemaValidation,
  userSchemaValidation,
} from "../middlewares/auth.middlewares.js";

const router = Router();

router.post("/signup", userSchemaValidation, createUser);
router.post("/signin", signInSchemaValidation, signIn);

export default router;
