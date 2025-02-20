/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Student } from "./student.model";


const getAllStudentFromDB = async () => {
  try {
    const result = await Student.find();
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
    // throw new Error(error._message || error.message || "Failed to get student");
  }
};
const getSingleStudentFromDB = async (id: string) => {
  try {
    // const result = await StudentModel.findOne({ _id: id });
    //const result = await Student.findById(id); // same ^|

    const objectId = new mongoose.Types.ObjectId(id);
    // using aggregate pipeline
    const result = await Student.aggregate([{ $match: { _id: objectId } }]);

    if (!result) {
      throw new Error("Student not found");
    }

    // console.log(result);
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
    // throw new Error(error._message || error.message || "Failed to get student");
  }
};
const deleteStudentFromDB = async (id: string) => {
  try {
    // const result = await StudentModel.findOne({ _id: id });
    const result = await Student.updateOne({ _id: id }, { isDeleted: true }); // same ^|
    if (!result) {
      throw new Error("Student not found");
    }
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
    // throw new Error(error._message || error.message || "Failed to get student");
  }
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
