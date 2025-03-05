/* eslint-disable @typescript-eslint/no-explicit-any */

import { TErrorSources, TGenericResponseError } from "../interface/error";

export const handleDuplicateError = (err: any): TGenericResponseError => {
  const statusCode = 400;

  //   const match = err?.errorResponse?.errmsg.match(/dup key: ({.*?})/);

  //   const duplicateValue = match ? match[1] : null;

  const key = Object.keys(err?.errorResponse?.keyValue || {})[0];
  const duplicateValue = err?.errorResponse?.keyValue?.[key];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${duplicateValue} already exists`,
    },
  ];

  return {
    statusCode,
    message: "Duplicate Validation Error",
    errorSources,
  };
};
