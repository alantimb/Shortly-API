import { Router } from "express";
import {
  findShortenUrl,
  createShortUrl,
  goToShortUrl,
  deleteShortUrl,
} from "../controllers/urls.controllers.js";
import { authRoutesValidation } from "../middlewares/auth.middlewares.js";
import { urlSchemaValidation } from "../middlewares/urls.middlewares.js";

const router = Router();

router.post(
  "/urls/shorten",
  authRoutesValidation,
  urlSchemaValidation,
  createShortUrl
);
router.get("/urls/:id", findShortenUrl);
router.get("/urls/open/:shortUrl", goToShortUrl);
router.delete("/urls/:id", authRoutesValidation, deleteShortUrl);

export default router;
