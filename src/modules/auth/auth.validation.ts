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

const refreshTokenValidation = z.object({
  cookies: z.object({
    refreshToken: z.string({ required_error: "refresh token is required!" }),
  }),
});
const forgotPasswordValidation = z.object({
  body: z.object({
    id: z.string({ required_error: "id is required!" }),
  }),
});
const resetPasswordValidation = z.object({
  body: z.object({
    id: z.string({ required_error: "id is required!" }),
    newPassword: z.string({ required_error: "User password is required!" }),
  }),
});

export const AuthUserValidation = {
  loginUserValidation,
  changeUserPasswordValidation,
  refreshTokenValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
