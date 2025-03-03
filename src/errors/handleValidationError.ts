import mongoose from "mongoose";
import { TErrorSources, TGenericResponseError } from "../interface/error";

export const handleValidationError = (
  err: mongoose.Error.ValidationError
): TGenericResponseError => {
  const statusCode = 400;

  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );

  return {
    statusCode,
    message: "Validation Error",
    errorSources,
  };
};
