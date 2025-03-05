import { Router } from "express";
import validateRequest from "../middleware/validateRequest";
import { AdminControllers } from "./admin.controller";
import { adminValidations } from "./admin.validation";

const router = Router();

router.get("/", AdminControllers.getAllAdmin);
router.get("/:adminId", AdminControllers.getSingleAdmin);
router.patch(
  "/update/:adminId",
  validateRequest(adminValidations.updateAdminValidationZodSchema),
  AdminControllers.updateAdmin
);
router.delete(
  "/delete/:adminId",

  AdminControllers.deleteAdmin
);

export const AdminRoutes = router;
