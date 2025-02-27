/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponseMessage from "../../utils/sendResponseMessage";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";

const createStudent = catchAsync(async (req, res, next) => {
  const { password, students: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(password, studentData);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created student",
    data: result,
  });
});

export const UserController = {
  createStudent,
};
