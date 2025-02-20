/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StudentService } from "./student.service";
// import { studentValidationSchema } from "./student.validation";

// import studentValidationZodSchema from "./student.zodValidation";



const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentService.getAllStudentFromDB();
    res.status(200).json({
      success: true,
      message: "successfully get all student",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error creating student",
      error: error,
      // error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.getSingleStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: "successfully get  student",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error getting student",
      error: error,
      // error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};
const deleteSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentService.deleteStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: "successfully deleted  student",
      data: result,
    });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:error.message || "error deleting student",
      error: error,
      // error: error instanceof Error ? error.message : "Unknown Error",
    });
  }
};

export const StudentController = {
  getAllStudent,
  getSingleStudent,
  deleteSingleStudent
};
