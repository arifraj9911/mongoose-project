import express from "express";
import { StudentController } from "./student.controller";
import validateRequest from "../middleware/validateRequest";
import { studentValidations } from "./student.zodValidation";

const router = express.Router();

// router.post("/create-student", StudentController.createStudent);
router.get("/get-all", StudentController.getAllStudent);
router.get("/get-single/:studentId", StudentController.getSingleStudent);
router.patch(
  "/update/:studentId",
  validateRequest(studentValidations.updateStudentValidationZodSchema),
  StudentController.updateStudent
);
router.delete("/delete/:studentId", StudentController.deleteSingleStudent);

export const StudentRoutes = router;
