import mongoose from "mongoose";

import { TAcademicDepartment } from "./academicDepartment.interface";
import { AcademicDepartment } from "./academicDepartment.model";

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  // if code not match with academic name, throw error
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }

  // way - 01(to handle existing element)
  // const isExistDepartment = await AcademicDepartment.findOne({
  //   name: payload.name,
  // });

  // if (isExistDepartment) {
  //   throw new Error("Department already exists");
  // }

  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find().populate("academicFaculty");
  return result;
};

const getSingleDepartmentFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const result = await AcademicDepartment.findOne({ _id: objectId }).populate(
    "academicFaculty"
  );

  return result;
};

const updateAcademicDepartmentIntoDB = async (
  id: string,
  payload: TAcademicDepartment
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Department doest not exist");
  }
  // const objectId = new mongoose.Types.ObjectId(id);
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }

  // const isExistDepartment = await AcademicDepartment.findOne({
  //   _id: new mongoose.Types.ObjectId(id),
  // });

  // if (!isExistDepartment) {
  //   throw new Error("Department doest not exist");
  // }

  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(id) },
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
