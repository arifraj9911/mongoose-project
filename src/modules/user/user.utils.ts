import { TAcademicSemesterSchema } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

export const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    { role: "student" },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const findLastFacultyId = async () => {
  const lastFacaulty = await User.findOne(
    { role: "faculty" },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFacaulty?.id ? lastFacaulty.id : undefined;
};

export const generatedStudentId = async (payload: TAcademicSemesterSchema) => {
  let currentId = (0).toString();

  const lastStudentId = await findLastStudentId(); // get full id i.e., 2025010001
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6); // 01
  const lastStudentYear = lastStudentId?.substring(0, 4); // 2025
  const currentCode = payload.code;
  const currentYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId?.substring(6);
  }

  let increment = (Number(currentId) + 1).toString().padStart(4, "0");

  increment = `${payload.year}${payload.code}${increment}`;

  return increment;
};

export const generatedFacultyId = async () => {
  const lastFacultyId = await findLastFacultyId();

  if (!lastFacultyId) {
    return 'F-0001';
  }

  const lastIdNumber = parseInt(lastFacultyId.split('-')[1], 10);
  const nextIdNumber = (lastIdNumber + 1).toString().padStart(4, '0');

  return `F-${nextIdNumber}`;
};
