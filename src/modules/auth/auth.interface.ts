import { Model } from "mongoose";
import { TUser } from "../user/user.interface";

export interface TLogingUser {
  id: string;
  password: string;
}

export interface UserLoginModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isUserDeleted(id: string): Promise<TUser>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isJWTIssuesTimestamps(
    passwordChnagedTimestamps: Date,
    jwtIssedTimestamp: number
  ): boolean;
}
