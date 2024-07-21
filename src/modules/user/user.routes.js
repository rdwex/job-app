import { Router } from "express";
import * as userController from "./user.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { validationMiddleware } from "../../middleware/validation-middleware.js";
import { SignUpSchema } from "./user.schema.js";
import { roles } from "../../utils/system-roles.js";

const router = Router();

router.post("/add", validationMiddleware(SignUpSchema), userController.signUp);
router.post("/sign-in", userController.signIn);
router.get("/verify-email/:token", userController.verifyEmail);
router.get("/list", auth(roles.USER_COMPANY_HR), userController.getUser);
router.get("/getUserDataAccount", auth(), userController.getUser);
router.put("/update", auth(roles.USER_COMPANY_HR), userController.updateUser);
router.put("/delete", auth(roles.USER_COMPANY_HR), userController.deleteUser);

export default router;
