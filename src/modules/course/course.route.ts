import express from "express";
import validateRequest from "../middleware/validateRequest";
import { CourseValidation } from "./course.validation";
import { CourseControllers } from "./course.controller";

const router = express.Router();

router.post(
  "/create",
  validateRequest(CourseValidation.createCourseValidation),
  CourseControllers.createCourse
);

router.get("/", CourseControllers.getAllCourses);
router.get("/:id", CourseControllers.getSingleCourse);
router.patch(
  "/update/:id",
  validateRequest(CourseValidation.updateCourseValidation),
  CourseControllers.updateCourse
);

router.put(
  "/:courseId/assign-faculties",
  validateRequest(CourseValidation.facultiesWithCourseValidation),
  CourseControllers.updateCourseFaculties
);

router.delete(
  "/:courseId/remove-faculties",
  validateRequest(CourseValidation.facultiesWithCourseValidation),
  CourseControllers.removeCourseFaculties
);

router.delete("/delete/:id", CourseControllers.deleteCourse);

export const CourseRoutes = router;
