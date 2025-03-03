import mongoose from "mongoose";
import config from "../../config";

import { AcademicSemester } from "../academicSemester/academicSemester.model";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generatedStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  try {
    const userData: Partial<TUser> = {};

    // if password not given, use default password
    userData.password = password || (config.default_pass as string);

    // set role
    userData.role = "student";

    const admissionSemester = await AcademicSemester.findById(
      payload.admissionSemester
    );

    if (!admissionSemester) {
      throw new Error("Admission semester not found");
    }

    // set manually generated id
    userData.id = await generatedStudentId(admissionSemester);

    // create session
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // transaction-1
      const result = await User.create([userData], { session });

      if (!result.length) {
        throw new Error("Failed to create User");
      }
      // set id,_id as user
      payload.id = result[0].id;
      payload.user = result[0]._id; //reference id

      // transaction-2
      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new Error("Failed to create Student");
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("Failed to create Student");
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
