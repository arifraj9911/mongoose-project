import { z } from "zod";

const preRequisiteCoursesSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().default(false),
});

const courseValidationSchema = z.object({
  title: z.string().min(1).trim(),
  prefix: z.string().min(1).trim(),
  code: z.number(),
  credits: z.number(),
  isDeleted: z.boolean().default(false),
  preRequisiteCourses: z.array(preRequisiteCoursesSchema).optional(),
});

const createCourseValidation = z.object({
  body: courseValidationSchema,
});

const updateCourseValidation = z.object({
  body: courseValidationSchema.partial(),
});

const facultiesWithCourseValidation = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidation = {
  createCourseValidation,
  updateCourseValidation,
  facultiesWithCourseValidation,
};
