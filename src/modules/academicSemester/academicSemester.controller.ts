/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import sendResponseMessage from "../../utils/sendResponseMessage";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../middleware/catchAsync";
import { AcademicSemesterServices } from "./academicSemester.service";

const createAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.createAcademicSemesterIntoDB(
    req.body
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully created academic semester",
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res, next) => {
  const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB();

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get all semester",
    data: result,
  });
});
const getSingleAcademicSemester = catchAsync(async (req, res, next) => {
  const { semesterId } = req.params;
  const result = await AcademicSemesterServices.getSingleSemesterFromDB(
    semesterId
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get a semester",
    data: result,
  });
});
const updateAcademicSemester = catchAsync(async (req, res, next) => {
  const { semesterId } = req.params;

  const result = await AcademicSemesterServices.updateAcademicSemesterIntoDB(
    semesterId,
    req.body
  );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully updated semester",
    data: result,
  });
});

export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
