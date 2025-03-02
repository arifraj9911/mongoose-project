import { z } from "zod";

const createAcademicFacultyValidation = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error:'Academic Faculty Name Must be String'
    }),
  }),
});
const updateAcademicFacultyValidation = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error:'Academic Faculty Name Must be String'
    }).optional(),
  }),
});

export const AcademicFacultyValidations = {
  createAcademicFacultyValidation,
  updateAcademicFacultyValidation,
};
