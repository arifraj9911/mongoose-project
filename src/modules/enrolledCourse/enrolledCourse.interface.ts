import { Types } from "mongoose";

export type TCourseMarks = {
  classTest1: number;
  midTerm: number;
  classTest2: number;
  finalTerm: number;
};

export type TGrade = "A" | "B" | "C" | "D" | "F" | "NA";

export type TEnrolledCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  offeredCourse: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  student: Types.ObjectId;
  isEnrolled: boolean;
  courseMarks: TCourseMarks;
  grade: TGrade;
  gradePoints: number;
  isCompleted: boolean;
};
