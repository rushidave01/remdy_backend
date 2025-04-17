// src/routes/index.ts
import { Router } from "express";
import adminRouter from "./admin";
import authRoutes from "./auth";
import homepageRouter from "./homepage";
import hospitalRoutes from "./hospital";
import publicRouter from "./public";
import userRouter from "./users";

import {
  verifyAdminAuthMiddleware,
  verifyUserAuthMiddleware,
} from "../middleware/verifyToken";

const router = Router();

/**
 * MOBILE APIS
 */
router.use("/auth", authRoutes);
router.use("/homepage", [verifyUserAuthMiddleware], homepageRouter);
router.use("/user", [verifyUserAuthMiddleware], userRouter);
router.use("/hospitals", [verifyUserAuthMiddleware], hospitalRoutes);
router.use("/public", [verifyUserAuthMiddleware], publicRouter);

/**
 * DASHBOARD APIS for ADMIN
 */
router.use("/admin", [verifyAdminAuthMiddleware], adminRouter);

export default router;
