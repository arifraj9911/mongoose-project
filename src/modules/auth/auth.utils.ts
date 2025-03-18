import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userId: string; userRole: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret as string) as JwtPayload;
};
