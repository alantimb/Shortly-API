import { Router } from "express";
import { shortUrl } from "../controllers/links.controllers.js";
import { authRoutesValidation } from "../middlewares/auth.middlewares.js";
import { urlSchemaValidation } from "../middlewares/links.middlewares.js";

const router = Router();

router.use(authRoutesValidation)
router.post("/urls/shorten", urlSchemaValidation, shortUrl);

export default router;
