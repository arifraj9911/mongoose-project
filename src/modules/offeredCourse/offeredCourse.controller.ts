/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { OfferedCourseServices } from "./offeredCourse.service";

const createOfferedCourse = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully create offered course",
    data: result,
  });
});
const getAllOfferedCourse = catchAsync(async (req, res, next) => {
  const result = await OfferedCourseServices.getAllOfferedCourseIntoDB(
    req.query
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get all offered course",
    data: result,
  });
});
const getSingleOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseIntoDB(id);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get a offered course",
    data: result,
  });
});
const updateOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully update offered course",
    data: result,
  });
});
const deleteOfferedCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully delete offered course",
    data: result,
  });
});

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourse,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
};
