/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Types, model } from "mongoose";
import validator from "validator";
import TFaculty, { FacultyModel } from "./faculty.interface";

const facultyNameSchema = new Schema({
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

const facultyGuardianSchema = new Schema({
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

const facultySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    user: { type: Types.ObjectId, required: true, ref: "User" },
    name: { type: facultyNameSchema, required: true },
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

    guardian: { type: facultyGuardianSchema, required: true },
    localGuardian: { type: facultyGuardianSchema, required: true },
    guardianContact: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^\d{11}$/.test(v),
        message: (props: any) =>
          `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
      },
    },

    academicDepartment: { type: Types.ObjectId, ref: "AcademicDepartment" },
    academicFaculty: { type: Types.ObjectId, ref: "AcademicFaculty" },
    isDeleted: { type: Boolean, default: false },
  },
  { toJSON: { virtuals: true }, timestamps: true }
);

// query hook middleware
facultySchema.pre("find", function (next) {
  // console.log(this);
  this.where({ isDeleted: { $ne: true } });

  next();
});

// virtual mongoose
facultySchema.virtual("fullName").get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
});

// creating Custom schema method
facultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = Faculty.findOne({ id });
  return existingUser;
};

export const Faculty = model<TFaculty, FacultyModel>("Faculty", facultySchema);
