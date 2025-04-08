import { NextFunction, Request, Response } from "express";
import { getDataSource } from "../config/database";
import { User } from "../entities/User";
import { UserRole } from "../enums";

export const verifyAdminRoleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.created_by;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is missing" });
    }

    const userRepository = getDataSource().getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user || user.user_role !== UserRole.admin) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Role check error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
