import { Router } from "express";
import { findShortenUrl, createShortUrl, goToShortUrl } from "../controllers/links.controllers.js";
import { authRoutesValidation } from "../middlewares/auth.middlewares.js";
import { urlSchemaValidation } from "../middlewares/links.middlewares.js";

const router = Router();

router.post(
  "/urls/shorten",
  authRoutesValidation,
  urlSchemaValidation,
  createShortUrl
);
router.get("/urls/:id", findShortenUrl);
router.get("/urls/open/:shortUrl", goToShortUrl);

export default router;
