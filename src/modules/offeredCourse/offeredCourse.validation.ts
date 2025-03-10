import { z } from "zod";
import { Days } from "./offeredCourse.constant";

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
      startTime: z
        .string()
        .regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
      endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
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
  body: z.object({
    faculty: z.string().optional(),
    maxCapacity: z.number().int().positive().optional(),
    section: z.number().int().positive().optional(),
    days: z.enum([...Days] as [string, ...string[]]).optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
  }),
});

export const OfferedCourseValidationSchema = {
  createOfferedCourseSchema,
  updateOfferedCourseSchema,
};
