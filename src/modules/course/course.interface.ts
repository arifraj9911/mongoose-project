import { Types } from "mongoose";

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourses = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  isDeleted: boolean;
  preRequisiteCourses: [TPreRequisiteCourses];
};

export type TCoursesFaculties = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
