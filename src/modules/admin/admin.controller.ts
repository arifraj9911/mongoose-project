/* eslint-disable @typescript-eslint/no-unused-vars */
import { StatusCodes } from "http-status-codes";
import sendResponseMessage from "../../utils/sendResponseMessage";
import catchAsync from "../middleware/catchAsync";
import { AdminServices } from "./admin.service";

const getAllAdmin = catchAsync(async (req, res, next) => {
  const result = await AdminServices.getAllAdminFromDB(req.query);

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully get all admin",
    data: result,
  });
});
const getSingleAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(adminId);

  if (!result) {
    throw new Error("Invalid ID or Admin doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully get a admin",
    data: result,
  });
});
const updateAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(adminId, admin);

  if (!result) {
    throw new Error("Invalid ID or Admin doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully updated admin",
    data: result,
  });
});
const deleteAdmin = catchAsync(async (req, res, next) => {
  const { adminId } = req.params;
  const result = await AdminServices.deleteAdminFromDB(adminId);

  if (!result) {
    throw new Error("Invalid ID or Admin doesn't exists");
  }

  sendResponseMessage(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Successfully deleted admin",
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
