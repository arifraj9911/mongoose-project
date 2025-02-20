import { z } from "zod";

const userZodValidation = z.object({
  password: z
    .string({
        invalid_type_error:'password must be string'
    })
    .max(20, { message: "password can not be more than 20 character" })
    .min(6, { message: "password must be at least 6 character" }).optional(),
});

export default userZodValidation;
