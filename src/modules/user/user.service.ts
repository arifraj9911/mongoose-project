/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import config from "../../config";

import { AcademicSemester } from "../academicSemester/academicSemester.model";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import {
  generatedAdminId,
  generatedFacultyId,
  generatedStudentId,
} from "./user.utils";
import TFaculty from "../faculty/faculty.interface";
import { Faculty } from "../faculty/faculty.model";
import TAdmin from "../admin/admin.interface";
import { Admin } from "../admin/admin.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: TStudent
) => {
  try {
    const userData: Partial<TUser> = {};

    // if password not given, use default password
    userData.password = password || (config.default_pass as string);

    // set role
    userData.role = "student";
    userData.email = payload.email;

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

      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const filePath = file.path;

      const { secure_url } = await sendImageToCloudinary(imageName, filePath);

      // transaction-1
      const result = await User.create([userData], { session });

      if (!result.length) {
        throw new Error("Failed to create User");
      }
      // set id,_id as user
      payload.id = result[0].id;
      payload.user = result[0]._id; //reference id
      payload.profileImage = secure_url;

      // transaction-2
      const newStudent = await Student.create([payload], { session });

      if (!newStudent.length) {
        throw new Error("Failed to create Student");
      }

      await session.commitTransaction();
      await session.endSession();

      return newStudent;
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(error);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  try {
    const userData: Partial<TUser> = {};

    // if password not given, use default password
    userData.password = password || (config.default_pass as string);

    // set role
    userData.role = "faculty";
    userData.email = payload.email;

    // set manually generated id
    userData.id = await generatedFacultyId();

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
      const newFaculty = await Faculty.create([payload], { session });

      if (!newFaculty.length) {
        throw new Error("Failed to create Faculty");
      }

      await session.commitTransaction();
      await session.endSession();

      return newFaculty;
    } catch (error: any) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error(error);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};

  // if password not given, use default password
  userData.password = password || (config.default_pass as string);

  // set role
  userData.role = "admin";
  userData.email = payload.email;

  // set manually generated id
  userData.id = await generatedAdminId();

  // create session
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // transaction-1
    const result = await User.create([userData], { session });

    if (!result.length) {
      throw new Error("Failed to create User");
    }
    // set id,_id as user
    payload.id = result[0].id;
    payload.user = result[0]._id; //reference id

    // transaction-2
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new Error("Failed to create Admin");
    }

    await session.commitTransaction();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getMe = async (userId: string, userRole: string) => {
  // const decoded = verifyToken(token, config.jwt_secret as string);
  let result = null;
  if (userRole === "student") {
    result = await Student.findOne({ id: userId }).populate("user");
  }
  if (userRole === "faculty") {
    result = await Faculty.findOne({ id: userId }).populate("user");
  }
  if (userRole === "admin") {
    result = await Admin.findOne({ id: userId }).populate("user");
  }

  return result;
};

const statusChange = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  getMe,
  statusChange,
};
