/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { FacultyServices } from "./faculty.service";

const getAllFaculty = catchAsync(async (req, res, next) => {
  console.log("test faculty", req.user);
  const result = await FacultyServices.getAllFacultyFromDB(req.query);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully get all faculty",
    data: result,
  });
});
const getSingleFaculty = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId);

  if (!result) {
    throw new Error("Invalid ID or Faculty doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully get a faculty",
    data: result,
  });
});
const updateFaculty = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(facultyId, faculty);

  if (!result) {
    throw new Error("Invalid ID or Faculty doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully updated faculty",
    data: result,
  });
});
const deleteFaculty = catchAsync(async (req, res, next) => {
  const { facultyId } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyId);

  if (!result) {
    throw new Error("Invalid ID or Faculty doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully deleted faculty",
    data: result,
  });
});

export const FacultyControllers = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
