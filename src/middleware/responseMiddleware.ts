// src/middleware/responseMiddleware.ts

import { Request, Response, NextFunction } from 'express';

export interface CustomResponse extends Response {
  sendSuccess(data: any): Response<any, Record<string, any>>;
  sendError(statusCode: number, message: string): Response<any, Record<string, any>>;
  notFound(): Response<any, Record<string, any>>;
}

export const responseMiddleware = (
  req: Request,
  res: CustomResponse,
  next: NextFunction
) => {
  res.sendSuccess = function(data: any) {
    return this.status(200).json({
      success: true,
      data,
    });
  };

  res.sendError = function(statusCode: number, message: string) {
    return this.status(statusCode).json({
      success: false,
      error: {
        code: statusCode,
        message,
      },
    });
  };

  res.notFound = function() {
    return this.status(404).json({
      success: false,
      error: {
        code: 404,
        message: 'Not Found',
      },
    });
  };

  next();
};
