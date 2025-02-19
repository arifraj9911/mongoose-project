/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import TStudent from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (student: TStudent) => {
  try {
    // const result = await StudentModel.create(student); //mongoose built in method

    // const existingUser = await Student.findOne({email:student.email});

    // if(existingUser){
    //   throw new Error('Student Already exist in this email')
    // }

    // by using static method
    if (await Student.isUserExists(student.id)) {
      throw new Error("User exists");
    }

    // mongoose built in instance method
    const studentData = new Student(student);
    const result = await studentData.save();

    return result;
  } catch (error) {
    console.log(error);
    throw error;
    // throw new Error(
    //   error._message || error.message || "Failed to create student"
    // );
  }
};

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
  createStudentIntoDB,
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
