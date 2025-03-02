import express from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../middleware/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(AcademicSemesterValidations.createAcademicSemesterValidation),
  AcademicSemesterControllers.createAcademicSemester
);

router.get("/", AcademicSemesterControllers.getAllAcademicSemester);
router.get(
  "/:semesterId",
  AcademicSemesterControllers.getSingleAcademicSemester
);
router.patch(
  "/update/:semesterId",
  validateRequest(AcademicSemesterValidations.updateAcademicSemesterValidation),
  AcademicSemesterControllers.updateAcademicSemester
);

export const AcademicSemesterRoutes = router;
