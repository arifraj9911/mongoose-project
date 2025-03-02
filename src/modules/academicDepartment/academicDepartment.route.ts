import express from "express";
import validateRequest from "../middleware/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { AcademicDepartmentControllers } from "./academicDepartment.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidation
  ),
  AcademicDepartmentControllers.createAcademicDepartment
);

router.get("/", AcademicDepartmentControllers.getAllAcademicDepartment);
router.get(
  "/:deptId",
  AcademicDepartmentControllers.getSingleAcademicDepartment
);
router.patch(
  "/update/:deptId",
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidation
  ),
  AcademicDepartmentControllers.updateAcademicDepartment
);

export const AcademicDepartmentRoutes = router;
