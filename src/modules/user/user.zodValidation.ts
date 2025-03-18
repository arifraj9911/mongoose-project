import { z } from "zod";
import { StatusChange } from "./user.constant";

const userZodValidation = z.object({
  password: z
    .string({
      invalid_type_error: "password must be string",
    })
    .max(20, { message: "password can not be more than 20 character" })
    .min(6, { message: "password must be at least 6 character" })
    .optional(),
  email: z.string({ required_error: "email should be given!" }),
});

const userStatusValidation = z.object({
  body: z.object({
    status: z.enum([...StatusChange] as [string, ...string[]]),
  }),
});

export const UserZodValidationSchema = {
  userZodValidation,
  userStatusValidation,
};
