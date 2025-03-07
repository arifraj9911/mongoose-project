/* eslint-disable @typescript-eslint/no-unused-vars */

import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { CourseServices } from "./course.service";
import mongoose from "mongoose";

const createCourse = catchAsync(async (req, res, next) => {
  const result = await CourseServices.createCourseIntoDB(req.body);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created course",
    data: result,
  });
});

const getAllCourses = catchAsync(async (req, res, next) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get all course",
    data: result,
  });
});
const getSingleCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get a course",
    data: result,
  });
});
const updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await CourseServices.updateCourseIntoDB(id, req.body);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully updated course",
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await CourseServices.deleteCourseFromDB(id);

  if (!result) {
    throw new Error("Course not found");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully deleted course",
    data: result,
  });
});

const updateCourseFaculties = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.assignFacultiesWithCourse(
    courseId,
    faculties
  );

  if (!result) {
    throw new Error("Course not found");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully updated course",
    data: result,
  });
});

const removeCourseFaculties = catchAsync(async (req, res, next) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.removeFacultiesFromCourse(
    courseId,
    faculties
  );

  if (!result) {
    throw new Error("Course not found");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully removed course",
    data: result,
  });
});

export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  updateCourseFaculties,
  removeCourseFaculties,
};
