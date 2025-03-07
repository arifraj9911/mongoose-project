import { model, Schema } from "mongoose";
import {
  TCourses,
  TCoursesFaculties,
  TPreRequisiteCourses,
} from "./course.interface";

export const preRequisiteCoursesSchema = new Schema<TPreRequisiteCourses>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Courses" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    _id: false,
  }
);

export const courseSchema = new Schema<TCourses>(
  {
    title: { type: String, required: true, unique: true, trim: true },
    prefix: { type: String, required: true, unique: true, trim: true },
    code: { type: Number, required: true, unique: true, trim: true },
    credits: { type: Number, required: true, trim: true },
    isDeleted: { type: Boolean, default: false },
    preRequisiteCourses: [preRequisiteCoursesSchema],
  },
  {
    timestamps: true,
  }
);

export const courseFacultySchema = new Schema<TCoursesFaculties>(
  {
    course: { type: Schema.Types.ObjectId, ref: "Courses", unique: true },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: "Faculty",
      },
    ],
  },
  {
    timestamps: true,
  }
);

courseSchema.pre("find", async function (next) {
  this.where({ isDeleted: { $ne: true } });

  next();
});
courseSchema.pre("findOne", async function (next) {
  this.where({ isDeleted: { $ne: true } });

  next();
});

export const Courses = model<TCourses>("Courses", courseSchema);
export const CourseFaculty = model<TCoursesFaculties>(
  "CourseFaculty",
  courseFacultySchema
);
