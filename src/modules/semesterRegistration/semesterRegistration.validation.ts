import { z } from "zod";
import { Types } from "mongoose";

export const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z
      .string()
      .refine((val) => Types.ObjectId.isValid(val), "Invalid Id"),
    status: z.enum(["UPCOMING", "ONGOING", "ENDED"]),
    startDate: z.preprocess((arg) => new Date(arg as string), z.date()),
    endDate: z.preprocess((arg) => new Date(arg as string), z.date()),
    minCredit: z.number().min(3, "Minimum credit must be at least 3"),
    maxCredit: z.number().min(3).max(16, "Maximum credit must be at most 16"),
  }),
});

export const updateSemesterRegistrationValidationSchema = z.object({
  body: z
    .object({
      academicSemester: z
        .string()
        .optional()
        .refine((val) => !val || Types.ObjectId.isValid(val), "Invalid Id"),
      status: z.enum(["UPCOMING", "ONGOING", "ENDED"]).optional(),
      startDate: z.preprocess(
        (arg) => new Date(arg as string),
        z.date().optional()
      ),
      endDate: z.preprocess(
        (arg) => new Date(arg as string),
        z.date().optional()
      ),
      minCredit: z
        .number()
        .min(3, "Minimum credit must be at least 3")
        .optional(),
      maxCredit: z
        .number()
        .min(3)
        .max(16, "Maximum credit must be at most 16")
        .optional(),
    })
    .partial(),
});

export const SemesterRegistrationValidation = {
  createSemesterRegistrationValidationSchema,
  updateSemesterRegistrationValidationSchema,
};
