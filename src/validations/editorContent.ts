import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ContentType } from "../enums";

// Validation Schema for CKEditor Content
const createEditorContentSchema = Joi.object({
  title: Joi.string().max(255).required(), // Title as string
  type: Joi.string()
    .valid(...Object.values(ContentType)) // Enum validation
    .required(),
  html_content: Joi.string().required(), // HTML content stored as text
  status: Joi.boolean().required(), // Boolean flag for activation
  created_by: Joi.number().integer().required(), // User ID (who created content)
});

// Middleware for CKEditor Content Validation
export const validateCreateEditorContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await createEditorContentSchema.validateAsync(req.body, {
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

const getEditorContentSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(ContentType)) // Validate against enum
    .required(),
});

// Middleware for GET Content Validation
export const validateGetEditorContent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getEditorContentSchema.validateAsync(req.query, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    return res.status(422).json({
      success: false,
      message: "Validation error",
      error:
        error instanceof Joi.ValidationError ? error.message : "Unknown error",
      data: null,
    });
  }
};
