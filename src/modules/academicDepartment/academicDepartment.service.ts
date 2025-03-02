import mongoose from "mongoose";

import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  // if code not match with academic name, throw error
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }

  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find();
  return result;
};

const getSingleDepartmentFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const result = await AcademicDepartment.findOne({ _id: objectId });

  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: TAcademicDepartment
) => {
  const objectId = new mongoose.Types.ObjectId(id);
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: objectId },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFromDB,
  getSingleDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
};
