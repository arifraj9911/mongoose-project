import { Router } from "express";
import { FacultyControllers } from "./faculty.controller";
import validateRequest from "../middleware/validateRequest";
import { facultyValidations } from "./faculty.validation";
import auth from "../middleware/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.get("/", auth(USER_ROLE.admin,USER_ROLE.faculty), FacultyControllers.getAllFaculty);
router.get("/:facultyId", FacultyControllers.getSingleFaculty);
router.patch(
  "/update/:facultyId",
  validateRequest(facultyValidations.updateFacultyValidationZodSchema),
  FacultyControllers.updateFaculty
);
router.delete(
  "/delete/:facultyId",

  FacultyControllers.deleteFaculty
);

export const FacultyRoutes = router;
