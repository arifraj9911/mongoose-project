/* eslint-disable @typescript-eslint/no-this-alias */
import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";
import { UserLoginModel } from "../auth/auth.interface";
import { StatusChange } from "./user.constant";

const userSchema = new Schema<TUser, UserLoginModel>(
  {
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: 0 },
    needsPasswordChange: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      required: true,
    },
    status: {
      type: String,
      enum: StatusChange,
      default: "in-progress",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// pre hook middleware
userSchema.pre("save", async function (next) {
  // console.log(this,'we will save data')
  const user = this; // this refer  current document
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});

// post hook middleware
userSchema.post("save", function (doc, next) {
  doc.password = "";
  next();
});

// statics for check user exists
userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await User.findOne({ id }).select("+password");
};

// statics for check user exists
userSchema.statics.isUserDeleted = async function (id: string) {
  const userDeletion = await User.findOne({ id }).select("isDeleted");

  return userDeletion?.get("isDeleted");
};

// statics for check user exists
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuesTimestamps = function (
  passwordChnagedTimestamps: Date,
  jwtIssedTimestamp: number
) {
  const passwordChangeTime = new Date(passwordChnagedTimestamps).getTime()/1000;
  return passwordChangeTime > jwtIssedTimestamp;
};

export const User = model<TUser, UserLoginModel>("User", userSchema);
