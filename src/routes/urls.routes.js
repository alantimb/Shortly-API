import { Router } from "express";
import { shortUrl } from "../controllers/links.controllers.js";
import { authRoutesValidation } from "../middlewares/auth.middlewares.js";
import { urlSchemaValidation } from "../middlewares/links.middlewares.js";

const router = Router();

router.post(
  "/urls/shorten",
  authRoutesValidation,
  urlSchemaValidation,
  shortUrl
);

export default router;
