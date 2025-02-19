import { z } from "zod";

const userNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Last Name must contain only letters" }),
});

const guardianValidationSchema = z.object({
  guardianName: z.string().min(1, { message: "Guardian Name is required" }),
  contact: z
    .string()
    .regex(/^\d{11}$/, {
      message: "Guardian phone number must be exactly 11 digits",
    }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  address: z.string().optional(),
});

const studentValidationZodSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  password: z.string().min(6, { message: "at least 6 character" }),
  name: userNameValidationSchema,
  email: z.string().email({ message: "Invalid email format" }),
  avatar: z.string().url({ message: "Invalid avatar URL" }).optional(),
  age: z
    .number()
    .min(15, { message: "Minimum age should be 15" })
    .max(40, { message: "Maximum age should be 40" }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be Male, Female, or Other",
  }),
  phone: z
    .string()
    .regex(/^\d{11}$/, { message: "Phone number must be exactly 11 digits" }),
  address: z.string().min(1, { message: "Address is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  rollNumber: z.string().min(1, { message: "Roll Number is required" }),
  registrationNumber: z
    .string()
    .min(1, { message: "Registration Number is required" }),
  admissionYear: z
    .number()
    .min(2000, { message: "Admission year must be 2000 or later" })
    .max(new Date().getFullYear(), {
      message: "Admission year cannot be in the future",
    }),
  guardian: guardianValidationSchema,
  isDeleted: z.boolean(),
});

export default studentValidationZodSchema;
