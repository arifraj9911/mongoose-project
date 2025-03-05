import { z } from "zod";

const createAdminUserNameValidationSchema = z.object({
  firstName: z.string().min(1, { message: "First Name is required" }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .min(1, { message: "Last Name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Last Name must contain only letters" }),
});

const createAdminGuardianValidationSchema = z.object({
  guardianName: z.string().min(1, { message: "Guardian Name is required" }),
  contact: z.string().regex(/^\d{11}$/, {
    message: "Guardian phone number must be exactly 11 digits",
  }),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  address: z.string().optional(),
});

const createAdminValidationZodSchema = z.object({
  body: z.object({
    admin: z.object({
      name: createAdminUserNameValidationSchema,
      designation: z.string({ message: "designation is required" }),
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
      profileImage: z
        .string()
        .url({ message: "Invalid profile image URL" })
        .optional(),

      managementDepartment: z.string(),
      guardian: createAdminGuardianValidationSchema,
      localGuardian: createAdminGuardianValidationSchema,
      guardianContact: z.string().regex(/^\d{11}$/, {
        message: "Guardian contact number must be exactly 11 digits",
      }),
    }),
  }),
});

const updateAdminUserNameValidationSchema = z.object({
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

const updateAdminGuardianValidationSchema = z.object({
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

const updateAdminValidationZodSchema = z.object({
  body: z.object({
    admin: z
      .object({
        name: updateAdminUserNameValidationSchema.optional(),
        designation: z.string().optional(),
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

        guardian: updateAdminGuardianValidationSchema.optional(),
        localGuardian: updateAdminGuardianValidationSchema.optional(),
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

export const adminValidations = {
  createAdminValidationZodSchema,
  updateAdminValidationZodSchema,
};
