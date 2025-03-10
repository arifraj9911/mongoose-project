import express from "express";
import validateRequest from "../middleware/validateRequest";
import { OfferedCourseValidationSchema } from "./offeredCourse.validation";
import { OfferedCourseController } from "./offeredCourse.controller";

const router = express.Router();

// router.post("/create-student", StudentController.createStudent);
router.post(
  "/create",
  validateRequest(OfferedCourseValidationSchema.createOfferedCourseSchema),
  OfferedCourseController.createOfferedCourse
);
router.get("/", OfferedCourseController.getAllOfferedCourse);
router.get("/:id", OfferedCourseController.getSingleOfferedCourse);
// router.patch(
//   "/update/:id",
//   validateRequest(
//     SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema
//   ),
//   SemesterRegistrationController.udpateSemesterRegistration
// );
// router.delete("/delete/:studentId", StudentController.deleteSingleStudent);

export const OfferedCourseRoutes = router;
