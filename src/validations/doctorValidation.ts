import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { AcceptingPatients } from "../enums";

// Joi schema for doctor registration validation
const doctorRegisterSchema = Joi.object({
  user_name: Joi.string().min(3).max(255).required(), // Doctor name is required
  user_email: Joi.string().email().max(250).required(), // Email is required and must be valid
  user_mobile: Joi.number().integer().positive().required(), // Positive integer mobile number required
  address: Joi.object({
    street: Joi.string().optional(), // Optional street field
    city: Joi.string().optional(), // Optional city field
    state: Joi.string().optional(), // Optional state field
    postal_code: Joi.string()
      .pattern(/^\d{5}(-\d{4})?$/) // US ZIP code format
      .optional(),
    country: Joi.string().optional(), // Optional country field
  }).optional(), // Entire address object is optional
});

// Joi schema for doctor login validation
const doctorLoginSchema = Joi.object({
  user_email: Joi.string().email().max(250).required(), // Email is required and must be valid
  user_password: Joi.string().min(4).max(255).required(), // Password must be between 4-255 characters
});

const updateAcceptingPatientsStatusSchema = Joi.object({
  doctorId: Joi.number().integer().required(),
  acceptingPatients: Joi.string()
    .valid(...Object.values(AcceptingPatients))
    .required(),
});

// Middleware to validate doctor registration request
export const validateDoctorRegisterSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await doctorRegisterSchema.validateAsync(req.body, { abortEarly: false }); // Run validation on entire request body
    next(); // Proceed if validation passes
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return res.status(422).json({
        success: false,
        message: "Validation error", // Return validation error response
        error: error.message,
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unexpected error during validation", // Return generic error response
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Middleware to validate doctor login request
export const validateDoctorLoginSchema = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await doctorLoginSchema.validateAsync(req.body, { abortEarly: false }); // Run validation on login body
    next(); // Proceed if validation passes
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return res.status(422).json({
        success: false,
        message: "Validation error", // Return validation error response
        error: error.message,
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: "Unexpected error during validation", // Return generic error response
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const validateUpdateAcceptingPatientsStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await updateAcceptingPatientsStatusSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    if (error instanceof Joi.ValidationError) {
      return res.status(422).json({
        success: false,
        message: "Validation error",
        error: error.message,
        data: null,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred during validation",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
};
