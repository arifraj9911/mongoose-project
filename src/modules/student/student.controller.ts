/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from "express";
import { StudentService } from "./student.service";
import sendResponseMessage from "../../utils/sendResponseMessage";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";

const getAllStudent = catchAsync(async (req, res, next) => {
  const result = await StudentService.getAllStudentFromDB();

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get all student",
    data: result,
  });
});
const getSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDB(studentId);

    sendResponseMessage(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "successfully get  student",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
const deleteSingleStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);

    sendResponseMessage(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "successfully deleted student",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    next(error);
  }
};

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent,
};
