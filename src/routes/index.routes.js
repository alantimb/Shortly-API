import { Router } from "express";
import authRoutes from "./auth.routes.js";
import urlRoutes from "./urls.routes.js";

const router = Router();
router.use(authRoutes);
router.use(urlRoutes);

export default router;
