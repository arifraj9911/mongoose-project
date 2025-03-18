import config from "../../config";
import { User } from "../user/user.model";
import { TLogingUser } from "./auth.interface";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createToken, verifyToken } from "./auth.utils";
import { sendEmail } from "../../utils/sendEmailNodemailer";

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

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.access_token_expiresIn as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.refresh_token_expiresIn as string
  );

  return {
    accessToken,
    refreshToken,
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

const refreshTokenService = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new Error("User does not exist!");
  }

  // check user is already deleted or not
  const isUserDeleted = await User.isUserDeleted(userId);

  if (isUserDeleted) {
    throw new Error("User is already deleted!!!");
  }

  if (user?.status === "blocked") {
    throw new Error("User is already blocked!!!");
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuesTimestamps(user?.passwordChangedAt, iat as number)
  ) {
    throw new Error("You are not authorized!! Need to login or new token!!");
  }

  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    config.access_token_expiresIn as string
  );

  return {
    accessToken,
  };
};

const forgotPassword = async (userId: string) => {
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new Error("User does not exist!");
  }

  // check user is already deleted or not
  const isUserDeleted = await User.isUserDeleted(userId);

  if (isUserDeleted) {
    throw new Error("User is already deleted!!!");
  }

  if (user?.status === "blocked") {
    throw new Error("User is already blocked!!!");
  }

  const jwtPayload = {
    userId: user?.id,
    userRole: user?.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_secret as string,
    "10m"
  );

  const resetLink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;

  sendEmail(user.email, resetLink);

  console.log(resetLink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new Error("User does not exist!");
  }

  // check user is already deleted or not
  const isUserDeleted = await User.isUserDeleted(payload?.id);

  if (isUserDeleted) {
    throw new Error("User is already deleted!!!");
  }

  if (user?.status === "blocked") {
    throw new Error("User is already blocked!!!");
  }

  const decoded = verifyToken(token, config.jwt_secret as string);
  // const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;

  if (decoded.userId !== payload.id) {
    throw new Error("You are not authorized to reset password!!");
  }

  //  hashed new password
  const newHashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await User.findOneAndUpdate(
    {
      id: decoded?.userId,
      role: decoded?.userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};

export const AuthServices = {
  loginUser,
  changePasswordUser,
  refreshTokenService,
  forgotPassword,
  resetPassword,
};
