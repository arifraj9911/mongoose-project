import { Types } from "mongoose";

type TDays = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type TOfferedCourse = {
  semesterRegistration: Types.ObjectId;
  academicSemester?: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDays[];
  startTime: string;
  endTime: string;
};

export type TScheduled = {
  days: TDays[];
  startTime: string;
  endTime: string;
};
