/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { AuthServices } from "./auth.service";
import config from "../../config";

const login = catchAsync(async (req, res, next) => {
  const result = await AuthServices.loginUser(req.body);

  const { accessToken, refreshToken, needsPasswordChange } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.node_env === "production",
    httpOnly: true,
  });

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login user successfully",
    data: {
      accessToken,
      needsPasswordChange,
    },
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

const refreshToken = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenService(refreshToken);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "access token retrives successfully",
    data: result,
  });
});
const forgotPass = catchAsync(async (req, res, next) => {
  const userId = req.body.id;
  const result = await AuthServices.forgotPassword(userId);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "forgot password link send successfully",
    data: result,
  });
});
const resetPass = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization;
  const result = await AuthServices.resetPassword(req.body, token as string);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "password reset successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  changePassword,
  refreshToken,
  forgotPass,
  resetPass,
};
