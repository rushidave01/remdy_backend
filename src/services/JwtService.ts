import { User } from "../entities";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getDataSource } from "../config/database";
import { UserRole } from "../enums/user.enum";
import { IGetUserAuthInfoRequest } from "../types/express";

interface CustomJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: string | undefined;
}

export class JwtService {
  constructor() {
    this.verifyJWT = this.verifyJWT.bind(this);
  }

  getUserRepository() {
    return getDataSource().getRepository(User);
  }

  async generateJWT(user: User): Promise<string> {
    const payload: CustomJwtPayload = {
      id: user.id,
      email: user.user_email,
      role: user.user_role,
    };
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: user.user_role === UserRole.patient ? "30d" : "24h",
    });
  }

  async verifyJWT(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      // Extract token from headers
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided" });
      }
      let decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
      let userId = decoded.id;
      console.log(decoded, "decoded");
      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token payload" });
      }

      // console.log("this >>>> ", this);

      let userFromDb = await this.getUserRepository().findOne({
        where: { id: userId },
      });
      if (!userFromDb) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      // Attach user to the request object for further use in routes
      // @ts-ignore
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res
          .status(401)
          .json({ success: false, message: "Token expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      } else {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error,
        });
      }
    }
  }
  async isPatient(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const customReq = req as IGetUserAuthInfoRequest;
      const { role } = customReq.user;
      if (role !== UserRole.patient) {
        return res.status(401).json({
          success: false,
          message: `You are not authorized to perform this action`,
        });
      } else {
        next();
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Error while verifying role`,
        error: error,
      });
    }
  }
}
