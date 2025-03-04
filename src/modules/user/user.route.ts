import express from "express";
import { UserController } from "./user.controller";
import { studentValidations } from "../student/student.zodValidation";
import validateRequest from "../middleware/validateRequest";
import { facultyValidations } from "../faculty/faculty.validation";

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

export const UserRoutes = router;
