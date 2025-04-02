import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { UserRole, notification_type, user_notification_type } from "../enums";

// Validation Schema for Sending a Notification
const sendNotificationSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(1000).optional(),
  notification_type: Joi.string()
    .valid(...Object.values(notification_type))
    .required(),
  user_notification_type: Joi.string()
    .valid(...Object.values(user_notification_type))
    .required(),
  latitude: Joi.number().integer().precision(6).optional(),
  longitude: Joi.number().integer().precision(6).optional(),
  location: Joi.string().max(255).optional(),
  location_range: Joi.string().max(12).optional(),
  // notification_date: Joi.date().optional(),
});

// Validation Schema for Getting Notifications (with Pagination)
const getNotificationsSchema = Joi.object({
  page: Joi.number().optional().default(1),
  size: Joi.number().optional().default(10),
  search: Joi.string().min(3).max(100).optional(),
  user_role_type: Joi.string()
    .valid(UserRole.patient, UserRole.doctor, UserRole.hospital)
    .optional(),
});

// Middleware for Sending Notification Validation
export const validateSendNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await sendNotificationSchema.validateAsync(req.body, { abortEarly: false });
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

// Middleware for Getting Notifications Validation
export const validateGetNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await getNotificationsSchema.validateAsync(req.query, {
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
