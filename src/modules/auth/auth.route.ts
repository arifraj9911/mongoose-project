import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../middleware/validateRequest";
import { AuthUserValidation } from "./auth.validation";
import auth from "../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthUserValidation.loginUserValidation),
  AuthController.login
);

router.post(
  "/change-password",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(AuthUserValidation.changeUserPasswordValidation),
  AuthController.changePassword
);

export const AuthRoutes = router;
