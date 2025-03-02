import { TAcademicSemesterSchema } from "../academicSemester/academicSemester.interface";
import { User } from "./user.model";

export const lastStudentId = async () => {
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

  // id suppose 2030010001 jodi hoy tahole substring diye 1st 6 digit remove kora hobe
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generatedStudentId = async (payload: TAcademicSemesterSchema) => {
  const currentId = (await lastStudentId()) || (0).toString();
  let increment = (Number(currentId) + 1).toString().padStart(4, "0");

  increment = `${payload.year}${payload.code}${increment}`;

  return increment;
};
