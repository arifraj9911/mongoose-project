import config from "../../config";
import { User } from "../user/user.model";
import { TLogingUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLogingUser) => {
  //   console.log(payload);

  // check user is exist or not
  //   const isUserExist = await User.findOne({ id: payload?.id });

  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new Error("User does not exist!");
  }

  // check user is already deleted or not
  const isUserDeleted = await User.isUserDeleted(payload?.id);
  // console.log(user);

  if (isUserDeleted) {
    throw new Error("User is already deleted!!!");
  }

  //   // check user is already blocked or not
  //   const isUserBlocked = isUserExist?.status;

  if (user?.status === "blocked") {
    throw new Error("User is already blocked!!!");
  }

  //   // check hash password
  //   const hashPassword = isUserExist?.password;

  //   const isPassMatched = await bcrypt.compare(payload?.password, hashPassword);

  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new Error("Password do not matched!!");
  }

  //   console.log(isPassMatched);

  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret as string, {
    expiresIn: "10d",
  });

  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePasswordUser = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string }
) => {
  const user = await User.isUserExistsByCustomId(userData?.userId);

  //   console.log(userData);
  //   console.log(user);

  if (!user) {
    throw new Error("User does not exist!");
  }

  // check user is already deleted or not
  const isUserDeleted = await User.isUserDeleted(userData?.userId);

  if (isUserDeleted) {
    throw new Error("User is already deleted!!!");
  }

  if (user?.status === "blocked") {
    throw new Error("User is already blocked!!!");
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user?.password))) {
    throw new Error("Password do not matched!!");
  }

  //  hashed new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: userData?.userId,
      role: userData?.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );

  return null;
};

export const AuthServices = {
  loginUser,
  changePasswordUser,
};
