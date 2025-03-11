import { z } from "zod";
import { Days } from "./offeredCourse.constant";

const timeStringSchema = z
  .string()
  .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)");

const createOfferedCourseSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicDepartment: z.string(),
      academicFaculty: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      section: z.number().int().positive(),

      days: z.array(z.enum([...Days] as [string, ...string[]]), {
        message: `Expected one of ${Days.join(" | ")}`,
      }),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
      },
      { message: "Start time should be before end time" }
    ),
});

const updateOfferedCourseSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number().int().positive(),
      section: z.number().int().positive(),
      days: z.array(z.enum([...Days] as [string, ...string[]]), {
        message: `Expected one of ${Days.join(" | ")}`,
      }),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const start = new Date(`1970-01-01T${body.startTime}:00`);
        const end = new Date(`1970-01-01T${body.endTime}:00`);

        return end > start;
      },
      { message: "Start time should be before end time" }
    ),
});

export const OfferedCourseValidationSchema = {
  createOfferedCourseSchema,
  updateOfferedCourseSchema,
};
