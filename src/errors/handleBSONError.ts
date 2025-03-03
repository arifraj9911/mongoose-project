/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericResponseError } from "../interface/error";

export const handleBSONError = (err: any): TGenericResponseError => {
  const statusCode = 400;

  const errorSources: TErrorSources = [
    {
      path: "id",
      message: "Invalid ID format. Please provide a valid ObjectId",
    },
  ];

  return {
    statusCode,
    message: "BSON Error",
    errorSources,
  };
};
