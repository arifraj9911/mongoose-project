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
  contact: z.string().regex(/^\d{11}$/, {
    message: "Guardian phone number must be exactly 11 digits",
  }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  address: z.string().optional(),
});

const studentValidationZodSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  user: z.string().min(1, { message: "User ID is required" }),
  name: userNameValidationSchema,
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  email: z.string().email({ message: "Invalid email format" }),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender must be Male, Female, or Other",
  }),
  dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  contactNo: z
    .string()
    .regex(/^\d{11}$/, { message: "Contact number must be exactly 11 digits" }),
  emergencyContact: z
    .string()
    .regex(/^\d{11}$/, {
      message: "Emergency contact number must be exactly 11 digits",
    }),
  presentAddress: z.string().min(1, { message: "Present address is required" }),
  permanentAddress: z
    .string()
    .min(1, { message: "Permanent address is required" }),
  profileImage: z
    .string()
    .url({ message: "Invalid profile image URL" })
    .optional(),
  admissionYear: z
    .number()
    .min(2000, { message: "Admission year must be 2000 or later" })
    .max(new Date().getFullYear(), {
      message: "Admission year cannot be in the future",
    }),
  guardian: guardianValidationSchema,
  localGuardian: guardianValidationSchema,
  guardianContact: z
    .string()
    .regex(/^\d{11}$/, {
      message: "Guardian contact number must be exactly 11 digits",
    }),
  isDeleted: z.boolean().default(false),
});

export default studentValidationZodSchema;
