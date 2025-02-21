/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const notFoundRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = StatusCodes.NOT_FOUND;
  const message = "API Not Found";

  res.status(statusCode).json({
    success: false,
    message,
    error: "",
  });

  return;
};

export default notFoundRoute;
