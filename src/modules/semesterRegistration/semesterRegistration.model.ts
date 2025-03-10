import { Schema, model } from "mongoose";
import { TSemesterRegsitration } from "./semesterRegistration.interface";

const semesterRegistrationSchema = new Schema<TSemesterRegsitration>({
  academicSemester: {
    type: Schema.Types.ObjectId,
    ref: "AcademicSemester",
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["UPCOMING", "ONGOING", "ENDED"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  minCredit: {
    type: Number,
    required: true,
  },
  maxCredit: {
    type: Number,
    required: true,
  },
});

const SemesterRegistration = model<TSemesterRegsitration>(
  "SemesterRegistration",
  semesterRegistrationSchema
);

export default SemesterRegistration;
