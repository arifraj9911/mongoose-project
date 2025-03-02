/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, Types, model } from "mongoose";
import TStudent, { StudentModel } from "./student.interface";
import validator from "validator";

const userNameSchema = new Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not appropriate for last name",
    },
  },
});

const guardianSchema = new Schema({
  guardianName: { type: String, required: [true, "Guardian Name is required"] },
  contact: {
    type: String,
    required: [true, "Guardian Contact is required"],
    validate: {
      validator: (v: string) => /^\d{11}$/.test(v),
      message: (props: any) =>
        `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
    },
  },
  email: { type: String, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
  address: { type: String },
});

const studentSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Types.ObjectId, required: true, ref: "User" },
    name: { type: userNameSchema, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "{VALUE} is not a valid email",
      },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    dateOfBirth: { type: Date, required: true },
    contactNo: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
      },
    },
    emergencyContact: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
      },
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    profileImage: { type: String },
    admissionYear: {
      type: Number,
      required: true,
      min: [2000, "Admission year must be 2000 or later"],
      max: [new Date().getFullYear(), "Admission year cannot be in the future"],
    },
    guardian: { type: guardianSchema, required: true },
    localGuardian: { type: guardianSchema, required: true },
    guardianContact: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
      },
    },
    admissionSemester: { type: Types.ObjectId, ref: "AcademicSemester" },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true } }
);

// query hook middleware
studentSchema.pre("find", function (next) {
  // console.log(this);
  this.where({ isDeleted: { $ne: true } });

  next();
});
// studentSchema.pre("findOne", function (next) {
//   // console.log(this);
//   this.where({ isDeleted: { $ne: true } });
//   // console.log("Modified Query:", this.getQuery());
//   next();
// });

// using pipeline()
studentSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  // this.where({ isDeleted: { $ne: true } });
  // console.log("Modified Query:", this.getQuery());
  next();
});

// virtual mongoose
studentSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// creating Custom schema method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = Student.findOne({ id });
  return existingUser;
};

export const Student = model<TStudent, StudentModel>("Student", studentSchema);
