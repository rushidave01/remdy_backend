// src/routes/index.ts
import { Router } from 'express';
import authRoutes from './auth';
import homepageRouter from './homepage';
import hospitalRoutes from './hospital';
import userRouter from './users';
import publicRouter from './public';
import adminRouter from './admin';

import { verifyUserAuthMiddleware, verifyAdminAuthMiddleware } from '../middleware/verifyToken';

const router = Router();

/**
 * MOBILE APIS
 */
router.use("/auth", authRoutes);
router.use('/homepage', [verifyUserAuthMiddleware], homepageRouter);
router.use("/user", [verifyUserAuthMiddleware], userRouter);
router.use("/hospitals", [verifyUserAuthMiddleware], hospitalRoutes);
router.use("/public", [verifyUserAuthMiddleware], publicRouter);

/**
 * DASHBOARD APIS
 */
router.use("/admin", [verifyAdminAuthMiddleware], adminRouter);

export default router;