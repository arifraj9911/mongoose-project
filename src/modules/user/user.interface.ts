import { USER_ROLE } from "./user.constant";

export interface TUser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  role: "student" | "admin" | "faculty";
  status: "in-progress" | "blocked";
  isDeleted?: boolean;
}

export type TUserRole = keyof typeof USER_ROLE;
