import { z } from "zod";

const loginUserValidation = z.object({
  body: z.object({
    id: z.string({ required_error: "ID is required!" }),
    password: z.string({ required_error: "Password is required!" }),
  }),
});

const changeUserPasswordValidation = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required!" }),
    newPassword: z.string({ required_error: "Password is required!" }),
  }),
});

export const AuthUserValidation = {
  loginUserValidation,
  changeUserPasswordValidation,
};
