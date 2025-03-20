/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrollCourse = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;

  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body
  );
  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student enrolled successfully",
    data: result,
  });
});

const updateEnrollCourse = catchAsync(async (req, res, next) => {
  const userId = req.user.userId;

  const result = await EnrolledCourseServices.updateEnrolledCourseIntoDB(
    userId,
    req.body
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Student enrolled updated successfully",
    data: result,
  });
});

export const EnrolledCourseController = {
  createEnrollCourse,
  updateEnrollCourse,
};
