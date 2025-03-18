import { z } from "zod";

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Last Name must contain only letters" }),
});

const createGuardianValidationSchema = z.object({
  guardianName: z.string().min(1, { message: "Guardian Name is required" }),
  contact: z.string().regex(/^\d{11}$/, {
    message: "Guardian phone number must be exactly 11 digits",
  }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  address: z.string().optional(),
});

const createstudentValidationZodSchema = z.object({
  body: z.object({
    students: z.object({
      name: createUserNameValidationSchema,
      email: z.string().email({ message: "Invalid email format" }),
      gender: z.enum(["Male", "Female", "Other"], {
        message: "Gender must be Male, Female, or Other",
      }),
      dateOfBirth: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
      contactNo: z.string().regex(/^\d{11}$/, {
        message: "Contact number must be exactly 11 digits",
      }),
      emergencyContact: z.string().regex(/^\d{11}$/, {
        message: "Emergency contact number must be exactly 11 digits",
      }),
      presentAddress: z
        .string()
        .min(1, { message: "Present address is required" }),
      permanentAddress: z
        .string()
        .min(1, { message: "Permanent address is required" }),
      // profileImage: z
      //   .string()
      //   .url({ message: "Invalid profile image URL" })
      //   .optional(),
      admissionYear: z
        .number()
        .min(2000, { message: "Admission year must be 2000 or later" })
        .max(new Date().getFullYear(), {
          message: "Admission year cannot be in the future",
        }),
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      guardian: createGuardianValidationSchema,
      localGuardian: createGuardianValidationSchema,
      guardianContact: z.string().regex(/^\d{11}$/, {
        message: "Guardian contact number must be exactly 11 digits",
      }),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required" })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Last Name must contain only letters" })
    .optional(),
});

const updateGuardianValidationSchema = z.object({
  guardianName: z
    .string()
    .min(1, { message: "Guardian Name is required" })
    .optional(),
  contact: z
    .string()
    .regex(/^\d{11}$/, {
      message: "Guardian phone number must be exactly 11 digits",
    })
    .optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  address: z.string().optional(),
});

const updateStudentValidationZodSchema = z.object({
  body: z.object({
    students: z
      .object({
        name: updateUserNameValidationSchema.optional(),
        email: z.string().email({ message: "Invalid email format" }).optional(),
        gender: z
          .enum(["Male", "Female", "Other"], {
            message: "Gender must be Male, Female, or Other",
          })
          .optional(),
        dateOfBirth: z
          .string()
          .refine((date) => !isNaN(Date.parse(date)), {
            message: "Invalid date format",
          })
          .optional(),
        contactNo: z
          .string()
          .regex(/^\d{11}$/, {
            message: "Contact number must be exactly 11 digits",
          })
          .optional(),
        emergencyContact: z
          .string()
          .regex(/^\d{11}$/, {
            message: "Emergency contact number must be exactly 11 digits",
          })
          .optional(),
        presentAddress: z.string().optional(),
        permanentAddress: z.string().optional(),
        profileImage: z
          .string()
          .url({ message: "Invalid profile image URL" })
          .optional(),
        admissionYear: z
          .number()
          .min(2000, { message: "Admission year must be 2000 or later" })
          .max(new Date().getFullYear(), {
            message: "Admission year cannot be in the future",
          })
          .optional(),
        admissionSemester: z.string().optional(),
        guardian: updateGuardianValidationSchema.optional(),
        localGuardian: updateGuardianValidationSchema.optional(),
        guardianContact: z
          .string()
          .regex(/^\d{11}$/, {
            message: "Guardian contact number must be exactly 11 digits",
          })
          .optional(),
      })
      .partial(),
  }),
});

export const studentValidations = {
  createstudentValidationZodSchema,
  updateStudentValidationZodSchema,
};
