import { Schema, model } from "mongoose";
import Student from "./student.interface";

const userNameSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});
const guardianNameSchema = new Schema({
  guardianName: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String },
  address: { type: String },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: true },
  name: userNameSchema,
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  phone: { type: String },
  address: { type: String },
  department: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true, unique: true },
  admissionYear: { type: Number, required: true },
  guardian: guardianNameSchema,
});

export const StudentModel = model<Student>("Student", studentSchema);
