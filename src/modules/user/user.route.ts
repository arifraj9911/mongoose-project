import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.zodValidation";
import validateRequest from "../middleware/validateRequest";
import { facultyValidations } from "../faculty/faculty.validation";
import { adminValidations } from "../admin/admin.validation";
import auth from "../middleware/auth";
import { USER_ROLE } from "./user.constant";
import { UserZodValidationSchema } from "./user.zodValidation";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
  "/create-student",
  auth(USER_ROLE.admin),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(studentValidations.createstudentValidationZodSchema),
  UserController.createStudent
);
router.post(
  "/create-faculty",
  validateRequest(facultyValidations.createFacultyValidationZodSchema),
  UserController.createFaculty
);
router.post(
  "/create-admin",
  validateRequest(adminValidations.createAdminValidationZodSchema),
  UserController.createAdmin
);

router.get(
  "/get-me",
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  UserController.getMe
);

router.patch(
  "/status-change/:id",
  auth(USER_ROLE.admin),
  validateRequest(UserZodValidationSchema.userStatusValidation),
  UserController.statusChange
);

export const UserRoutes = router;
