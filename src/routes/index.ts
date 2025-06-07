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
  verifyDoctorAuthMiddleware,
  verifyUserAuthMiddleware,
} from "../middleware/verifyToken";
import doctorRouter from "./doctor";

const router = Router();

/**
 * MOBILE APIS
 */
router.use("/auth", authRoutes);
router.use("/homepage", [verifyUserAuthMiddleware], homepageRouter);
router.use("/user", [verifyUserAuthMiddleware], userRouter);
router.use("/hospitals", [verifyUserAuthMiddleware], hospitalRoutes);
router.use("/public", publicRouter);

/**
 * DASHBOARD APIS for ADMIN
 */
router.use("/admin", [verifyAdminAuthMiddleware], adminRouter);

/**
 * DASHBOARD APIS for Doctor
 */
router.use("/doctor", [verifyDoctorAuthMiddleware], doctorRouter);

export default router;
