/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { SemesterRegistrationServices } from "./semesterRegistration.service";

const createSemesterRegistration = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body
    );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully create semester registration",
    data: result,
  });
});

const getAllSemesterRegistration = catchAsync(async (req, res, next) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(
      req.query
    );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get all semester registration",
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully get a semester registration",
    data: result,
  });
});

const udpateSemesterRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationFromDB(
      id,
      req.body
    );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully update semester registration",
    data: result,
  });
});

const deleteSemesterRegistration = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationWithAssociateOfferedCourse(
      id
    );

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "successfully delete semester registration",
    data: result,
  });
});

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  udpateSemesterRegistration,
  deleteSemesterRegistration,
};
