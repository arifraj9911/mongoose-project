/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import config from "../../config";
import { ZodError, ZodIssue } from "zod";
import { TErrorSources } from "../../interface/error";
import { handleZodError } from "../../errors/handleZodError";
import { handleCastError } from "../../errors/handleCastError";
import { handleBSONError } from "../../errors/handleBSONError";
import { handleDuplicateError } from "../../errors/handleDuplicateError";
import { handleValidationError } from "../../errors/handleValidationerror";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let message = error.message || "Something went wrong";
  let statusCode = error.statusCode || StatusCodes.BAD_REQUEST;

  let errorSources: TErrorSources = [
    {
      path: "",
      message,
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);

    (statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message),
      (errorSources = simplifiedError.errorSources);
  } else if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);

    (statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message),
      (errorSources = simplifiedError.errorSources);
  } else if (error?.name === "CastError") {
    const simplifiedError = handleCastError(error);

    (statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message),
      (errorSources = simplifiedError.errorSources);
  } else if (error?.name === "BSONError") {
    const simplifiedError = handleBSONError(error);

    (statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message),
      (errorSources = simplifiedError.errorSources);
  } else if (error?.errorResponse.code === 11000) {
    const simplifiedError = handleDuplicateError(error);

    (statusCode = simplifiedError.statusCode),
      (message = simplifiedError.message),
      (errorSources = simplifiedError.errorSources);
  }

  // if (
  //   error.name &&
  //   error.name === "BSONError" &&
  //   error.message &&
  //   error.message.includes(
  //     "input must be a 24 character hex string, 12 byte Uint8Array, or an integer"
  //   )
  // ) {
  //   message = "Invalid ID format. Please provide a valid ObjectId";
  // }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    // zodCustomError: error,
    error,
    stack:
      config.node_env === "development" ? error?.stack || error : undefined,
  });

  return;
};

export default globalErrorHandler;
