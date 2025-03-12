/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { AuthServices } from "./auth.service";

const login = catchAsync(async (req, res, next) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login user successfully",
    data: result,
  });
});

const changePassword = catchAsync(async (req, res, next) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePasswordUser(req.user, passwordData);

  //   console.log(req.user, req.body);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  changePassword,
};
