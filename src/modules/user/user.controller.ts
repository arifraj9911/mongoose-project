/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendResponseMessage from "../../utils/sendResponseMessage";
import { StatusCodes } from "http-status-codes";

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student: studentData } = req.body;

    // validate using zod
    // const userSchemaValidationWithZod =
    //   userZodValidation.parse(studentData);

    // const { error, value } = studentValidationSchema.validate(studentData);

    // console.log(studentSchemaValidationWithZod);
    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: "error creating student",
    //     error: error.details,
    //   });
    // }

    const result = await UserServices.createStudentIntoDB(
      password,
      studentData
    );
    // res.status(200).json({
    //   success: true,
    //   message: "successfully created student",
    //   data: result,
    // });
    sendResponseMessage(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "successfully created student",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const UserController = {
  createStudent,
};
