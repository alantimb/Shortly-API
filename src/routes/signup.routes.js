import { Router } from "express";
import { createUser } from "../controllers/auth.controllers.js";
import { validSchemaUser } from "../middlewares/auth.middlewares.js";

const signupRouter = Router();

signupRouter.post("/signup", validSchemaUser, createUser);

export default signupRouter;
