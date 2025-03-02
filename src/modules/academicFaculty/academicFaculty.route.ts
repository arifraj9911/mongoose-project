import express from "express";
import validateRequest from "../middleware/validateRequest";
import { AcademicFacultyControllers } from "./academicFaculty.controller";
import { AcademicFacultyValidations } from "./academicFaculty.valization";

const router = express.Router();

router.post(
  "/create",
  validateRequest(AcademicFacultyValidations.createAcademicFacultyValidation),
  AcademicFacultyControllers.createAcademicFaculty
);

router.get("/", AcademicFacultyControllers.getAllAcademicFaculty);
router.get("/:facultyId", AcademicFacultyControllers.getSingleAcademicFaculty);
router.patch(
  "/update/:facultyId",
  validateRequest(AcademicFacultyValidations.updateAcademicFacultyValidation),
  AcademicFacultyControllers.updateAcademicFaculty
);

export const AcademicFacultyRoutes = router;
