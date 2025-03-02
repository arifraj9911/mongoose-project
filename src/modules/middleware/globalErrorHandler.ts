/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = error.message || "Something went wrong";
  const statusCode = error.statusCode || StatusCodes.BAD_REQUEST;
  res.status(statusCode).json({
    success: false,
    message,
    error: error.stack || error,
  });

  return;
};

export default globalErrorHandler;
