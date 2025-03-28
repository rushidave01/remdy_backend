import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserRole } from "../enums";
 
const getCustomersSchema = Joi.object({
    search: Joi.string().min(3).max(100).optional(),
    user_role_type: Joi.string().valid(UserRole.patient, UserRole.doctor, UserRole.hospital).optional(),
    page: Joi.string().optional(),
    size: Joi.string().optional(),
});

export const validateGetCustomersSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getCustomersSchema.validateAsync(req.query);
    next();
  } catch (error) {
    Joi.isError(error)
      ? res.status(422).json({
          success: false,
          message: error.details[0].message,
          data: null,
        })
      : res.status(422).json({
          success: false,
          message: "An unexpected error occurred in joi validation",
          data: null,
        });
  }
};