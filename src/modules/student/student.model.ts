/* eslint-disable @typescript-eslint/no-this-alias */
import { Schema, model } from "mongoose";
import TStudent, { StudentModel } from "./student.interface";
import validator from "validator";
import bcrypt from "bcrypt";
import config from "../../config";

const userNameSchema = new Schema({
  firstName: { type: String, required: [true, "First Name is required"] },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, "Last Name is required"],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: "{VALUE} is not appropreate for last name",
    },
  },
});

const guardianNameSchema = new Schema({
  guardianName: { type: String, required: [true, "Guardian Name is required"] },
  contact: {
    type: String,
    required: [true, "Guardian Contact is required"],
    validate: {
      validator: function (v: string) {
        return /^\d{11}$/.test(v); // Ensures exactly 11 digits
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message: (props: any) =>
        `${props.value} is not a valid guardian phone number! It must be exactly 11 digits.`,
    },
  },
  email: { type: String, match: [/^\S+@\S+\.\S+$/, "Invalid email format"] },
  address: { type: String },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: { type: String, required: [true, "ID is required"], unique: true },
    password: { type: String, required: [true, "password is required"] },
    name: {
      type: userNameSchema,
      required: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "{VALUE} is not proper email",
      },
    },
    avatar: { type: String },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [15, "Minimum age should be 15"],
      max: [40, "Maximum age should be 40"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "{VALUE} is not supported",
      },
      required: [true, "Gender is required"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v: string) {
          return /^\d{11}$/.test(v); // Ensures exactly 11 digits
        },
        message: (props) =>
          `${props.value} is not a valid phone number! It must be exactly 11 digits.`,
      },
    },
    address: { type: String, required: [true, "Address is required"] },
    department: { type: String, required: [true, "Department is required"] },
    rollNumber: {
      type: String,
      required: [true, "Roll Number is required"],
      unique: true,
    },
    registrationNumber: {
      type: String,
      required: [true, "Registration Number is required"],
      unique: true,
    },
    admissionYear: {
      type: Number,
      required: [true, "Admission Year is required"],
      min: [2000, "Admission year must be 2000 or later"],
      max: [new Date().getFullYear(), "Admission year cannot be in the future"],
    },
    guardian: {
      type: guardianNameSchema,
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// pre hook middleware
studentSchema.pre("save", async function (next) {
  // console.log(this,'we will save data')
  const user = this; // this refer  current document
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// post hook middleware
studentSchema.post("save", function (doc, next) {
  doc.password = "";

  // console.log(this, "we saved our data");

  next();
});

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
