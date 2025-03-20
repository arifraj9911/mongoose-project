import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { EnrollerCourseValidationSchema } from "./enrolledCourse.validation";
import { EnrolledCourseController } from "./enrolledCourse.controller";
import auth from "../middleware/auth";

const router = Router();

router.post(
  "/create",
  auth("student"),
  validateRequest(
    EnrollerCourseValidationSchema.createEnrolledCourseValidation
  ),
  EnrolledCourseController.createEnrollCourse
);

router.patch(
  "/update",
  auth("faculty"),
  validateRequest(
    EnrollerCourseValidationSchema.updatedEnrolledCourseValidation
  ),
  EnrolledCourseController.updateEnrollCourse
);

export const EnrolledCourseRouter = router;
