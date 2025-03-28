import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const signInWithGoogleSchema = Joi.object({
  googleToken: Joi.string().required(),
  latitude: Joi
  // .number()
  // .min(-180)
  // .max(180)
  .string()
  .pattern(/^[+-]?(\d+(\.\d*)?|\.\d+)$/)
  .required()
  .messages({
      // 'number.min': 'Longitude must be between -180 and 180.',
      // 'number.max': 'Longitude must be between -180 and 180.',
      'any.required': 'Longitude is required.',
      'number.base': 'Longitude must be a number string.',
  }),
  // .min(-90).max(90).precision(6),
  longitude: Joi
    // .number()
    // .min(-180)
    // .max(180)
    .string()
    .pattern(/^[+-]?(\d+(\.\d*)?|\.\d+)$/)
    .required()
    .messages({
        // 'number.min': 'Longitude must be between -180 and 180.',
        // 'number.max': 'Longitude must be between -180 and 180.',
        'any.required': 'Longitude is required.',
        'number.base': 'Longitude must be a number string.',
    }),
  // .min(-180).max(180).precision(6),
  imei_number: Joi.string().optional().allow(""),
});

const loginWithEmailSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
});

export const validateSignInWithGoogleSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await signInWithGoogleSchema.validateAsync(req.body);
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

export const validateLoginWithEmailSchema= async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await loginWithEmailSchema.validateAsync(req.body);
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