/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponseMessage from "../../utils/sendResponseMessage";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";

const createStudent = catchAsync(async (req, res, next) => {
  const { password, students: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData
  );

  // console.log(req.file);
  // console.log(req.body);
  // console.log(result);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created student",
    data: result,
  });
});
const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body;

  const result = await UserServices.createFacultyIntoDB(password, facultyData);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created faculty",
    data: result,
  });
});
const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminIntoDB(password, adminData);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created admin",
    data: result,
  });
});

const getMe = catchAsync(async (req, res, next) => {
  // const token = req.headers.authorization

  const { userId, userRole } = req.user;

  const result = await UserServices.getMe(userId, userRole);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully retrive own user",
    data: result,
  });
});

const statusChange = catchAsync(async (req, res, next) => {
  // const token = req.headers.authorization

  const { id } = req.params;

  const result = await UserServices.statusChange(id, req.body);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully status change user",
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  statusChange,
};
