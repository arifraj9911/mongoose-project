import mongoose from "mongoose";
import { TErrorSources, TGenericResponseError } from "../interface/error";

export const handleCastError = (
  err: mongoose.Error.CastError
): TGenericResponseError => {
  const statusCode = 400;

  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];

  return {
    statusCode,
    message: "Cast Validation Error",
    errorSources,
  };
};
