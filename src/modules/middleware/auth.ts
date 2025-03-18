import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "./catchAsync";
import config from "../../config";
import { TUserRole } from "../user/user.interface";
import { User } from "../user/user.model";

// validation auth middleware (higher order function)
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if token given
    if (!token) {
      throw new Error("You are not authorized!!");
    }

    const decoded = jwt.verify(
      token,
      config.jwt_secret as string
    ) as JwtPayload;

    const { userRole, userId, iat } = decoded;

    const user = await User.isUserExistsByCustomId(userId);

    //   console.log(userData);
    //   console.log(user);

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

    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new Error("You are not authorized!!");
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
