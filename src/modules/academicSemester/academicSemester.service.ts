import mongoose from "mongoose";
import { AcademicSemesterNameCodeMapper } from "./academicSemester.constant";
import { TAcademicSemesterSchema } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";

const createAcademicSemesterIntoDB = async (
  payload: TAcademicSemesterSchema
) => {
  // if code not match with academic name, throw error
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester Name Code");
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleSemesterFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const result = await AcademicSemester.findOne({ _id: objectId });

  return result;
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: TAcademicSemesterSchema
) => {
  const objectId = new mongoose.Types.ObjectId(id);
  if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error("Invalid Semester Name Code");
  }
  const result = await AcademicSemester.findOneAndUpdate(
    { _id: objectId },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemesterFromDB,
  getSingleSemesterFromDB,
  updateAcademicSemesterIntoDB,
};
