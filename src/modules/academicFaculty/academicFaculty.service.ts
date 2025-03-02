import mongoose from "mongoose";
import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFaculty } from "./academicFaculty.model";

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  // if code not match with academic name, throw error
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }

  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFacultyFromDB = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const objectId = new mongoose.Types.ObjectId(id);
  const result = await AcademicFaculty.findOne({ _id: objectId });

  return result;
};

const updateAcademicFacultyIntoDB = async (
  id: string,
  payload: TAcademicFaculty
) => {
  const objectId = new mongoose.Types.ObjectId(id);
  //   if (AcademicSemesterNameCodeMapper[payload.name] !== payload.code) {
  //     throw new Error("Invalid Semester Name Code");
  //   }
  const result = await AcademicFaculty.findOneAndUpdate(
    { _id: objectId },
    { $set: payload },
    {
      new: true,
      runValidators: true,
    }
  );
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultyFromDB,
  getSingleFacultyFromDB,
  updateAcademicFacultyIntoDB,
};
