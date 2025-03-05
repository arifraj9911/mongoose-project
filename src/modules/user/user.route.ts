import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.zodValidation";
import validateRequest from "../middleware/validateRequest";
import { facultyValidations } from "../faculty/faculty.validation";
import { adminValidations } from "../admin/admin.validation";

const router = express.Router();

router.post(
  "/create-student",
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

export const UserRoutes = router;
