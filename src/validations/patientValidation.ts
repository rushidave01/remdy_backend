import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const storePatientLocationSchema = Joi.object({
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
      "any.required": "Longitude is required.",
      "number.base": "Longitude must be a number string.",
    }),
  longitude: Joi
    // .number()
    // .min(-180)
    // .max(180)
    // .precision(6),
    .string()
    .pattern(/^[+-]?(\d+(\.\d*)?|\.\d+)$/)
    .required()
    .messages({
      // 'number.min': 'Longitude must be between -180 and 180.',
      // 'number.max': 'Longitude must be between -180 and 180.',
      "any.required": "Longitude is required.",
      "number.base": "Longitude must be a number string.",
    }),
  city: Joi.string().optional().allow(""),
  address: Joi.string().required(),
  userId: Joi.number().required(),
});

const wishlistSchema = Joi.object({
  userId: Joi.number().required(),
  doctorId: Joi.number().required(),
  type: Joi.string().valid("add", "remove").required(),
});

const wishlistSchemaForHospital = Joi.object({
  userId: Joi.number().required(),
  hospitalId: Joi.number().required(),
  type: Joi.string().valid("add", "remove").required(),
});

const getWishlistSchema = Joi.object({
  userId: Joi.number().required(),
  type: Joi.string().valid("DOCTOR", "HOSPITAL").required(),
});

const commentSchema = Joi.object({
  userId: Joi.number().required(),
  doctorId: Joi.when("type", {
    is: "DOCTOR",
    then: Joi.number().required(),
    otherwise: Joi.forbidden(),
  }),
  hospitalId: Joi.when("type", {
    is: "HOSPITAL",
    then: Joi.number().required(),
    otherwise: Joi.forbidden(),
  }),
  comment: Joi.string().required(),
  rating: Joi.number().min(0).max(5).required(),
  type: Joi.string().valid("DOCTOR", "HOSPITAL").required(),
});

export const validateStorePatientLocationSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await storePatientLocationSchema.validateAsync(req.body);
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

export const validateWishlistSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await wishlistSchema.validateAsync(req.body);
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

export const validatewishlistSchemaForHospital = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await wishlistSchemaForHospital.validateAsync(req.body);
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

export const validateGetWishlistSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getWishlistSchema.validateAsync(req.query);
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

export const validateCommentSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await commentSchema.validateAsync(req.body);
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
