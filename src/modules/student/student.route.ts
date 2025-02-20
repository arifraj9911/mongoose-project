import express from "express";
import { StudentController } from "./student.controller";

const router = express.Router();

// router.post("/create-student", StudentController.createStudent);
router.get("/get-all", StudentController.getAllStudent);
router.get("/get-single/:studentId", StudentController.getSingleStudent);
router.delete("/delete/:studentId", StudentController.deleteSingleStudent);

export const StudentRoutes = router;
