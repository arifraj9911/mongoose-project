import express from "express";
import { SemesterRegistrationController } from "./semesterRegistration.controller";
import validateRequest from "../middleware/validateRequest";
import { SemesterRegistrationValidation } from "./semesterRegistration.validation";

const router = express.Router();

// router.post("/create-student", StudentController.createStudent);
router.post(
  "/create",
  validateRequest(
    SemesterRegistrationValidation.createSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.createSemesterRegistration
);
router.get("/", SemesterRegistrationController.getAllSemesterRegistration);
router.get(
  "/:id",
  SemesterRegistrationController.getSingleSemesterRegistration
);
router.patch(
  "/update/:id",
  validateRequest(
    SemesterRegistrationValidation.updateSemesterRegistrationValidationSchema
  ),
  SemesterRegistrationController.udpateSemesterRegistration
);
// router.delete("/delete/:studentId", StudentController.deleteSingleStudent);

export const SemeterRegistrationRoutes = router;
