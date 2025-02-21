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
  const message = error || "Something went wrong";

  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message,
    error,
  });

  return;
};

export default globalErrorHandler;
