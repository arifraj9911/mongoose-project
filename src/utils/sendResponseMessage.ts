import { Response } from "express";

interface TResponse<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
}

const sendResponseMessage = <T>(res: Response, data: TResponse<T>) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
  });
};

export default sendResponseMessage;
