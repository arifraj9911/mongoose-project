import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import catchAsync from "./catchAsync";
import config from "../../config";
import { TUserRole } from "../user/user.interface";

// validation auth middleware (higher order function)
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // check if token given
    if (!token) {
      throw new Error("You are not authorized!!");
    }

    jwt.verify(token, config.jwt_secret as string, function (err, decoded) {
      if (err) {
        throw new Error("You are not authorized!!");
      }

      const role = (decoded as JwtPayload).userRole;
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new Error("You are not authorized!!");
      }

      req.user = decoded as JwtPayload;
      next();
    });
  });
};

export default auth;
