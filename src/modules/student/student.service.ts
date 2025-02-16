/* eslint-disable @typescript-eslint/no-explicit-any */
import Student from "./student.interface";
import { StudentModel } from "./student.model";

const createStudentIntoDB = async (student: Student) => {
  try {
    const result = await StudentModel.create(student);
    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error(
      error._message || error.message || "Failed to create student"
    );
  }
};

const getAllStudentFromDB = async () => {
  try {
    const result = await StudentModel.find();
    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error(error._message || error.message || "Failed to get student");
  }
};
const getSingleStudentFromDB = async (id: string) => {
  try {
    // const result = await StudentModel.findOne({ _id: id });   
    const result = await StudentModel.findById(id);    // same ^|
    if (!result) {
      throw new Error("Student not found");
    }
    return result;
  } catch (error: any) {
    console.log(error);
    throw new Error(error._message || error.message || "Failed to get student");
  }
};

export const StudentService = {
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
};
