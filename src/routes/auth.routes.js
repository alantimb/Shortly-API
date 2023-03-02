import { Router } from "express";
import { createUser, signIn } from "../controllers/auth.controllers.js";
import { signInSchemaValidation, userSchemaValidation } from "../middlewares/auth.middlewares.js";

const authRouter = Router();

authRouter.post("/signup", userSchemaValidation, createUser);
authRouter.post("/signin", signInSchemaValidation, signIn);

export default authRouter;
