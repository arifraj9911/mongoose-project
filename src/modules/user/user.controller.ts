/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
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
    res.status(200).json({
      success: true,
      message: "successfully created student",
      data: result,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message || "error creating student",
      error: error,
    });
  }
};

export const UserController = {
    createStudent
}
