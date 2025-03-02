import { model, Schema } from "mongoose";
import { TAcademicSemesterSchema } from "./academicSemester.interface";
import {
  AcademicSemesterCode,
  AcademicSemesterName,
  Months,
} from "./academicSemester.constant";

const academicSemesterSchema = new Schema<TAcademicSemesterSchema>(
  {
    name: { type: String, required: true, enum: AcademicSemesterName },
    code: { type: String, required: true, enum: AcademicSemesterCode },
    year: { type: String, required: true },
    startMonth: { type: String, required: true, enum: Months },
    endMonth: { type: String, required: true, enum: Months },
  },
  {
    timestamps: true,
  }
);

// pre hook middlware
academicSemesterSchema.pre("save", async function (next) {
  const isSemesterExists = await AcademicSemester.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExists) {
    throw new Error("Semester is already exist");
  }

  next();
});

export const AcademicSemester = model<TAcademicSemesterSchema>(
  "AcademicSemester",
  academicSemesterSchema
);
