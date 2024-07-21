import { Router } from "express";
import * as jobController from "./job.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { validationMiddleware } from "../../middleware/validation-middleware.js";
import { addApplicationSchema, jobSchema } from "./job.schema.js";
import { roles, systemRoles } from "../../utils/system-roles.js";

const router = Router();

router.post(
  "/add",
  auth(systemRoles.COMPANY_HR),
  validationMiddleware(jobSchema),
  jobController.addJob
);

router.get("/get", auth(roles.USER_COMPANY_HR), jobController.getJob);

router.get("/listJobs", auth(roles.USER_COMPANY_HR), jobController.getAllJobs);

router.get("/update/:_id", jobController.updateJob);

router.delete(
  "/delete/:_id",
  auth(systemRoles.COMPANY_HR),
  jobController.deleteJob
);

router.get(
  "/filterJobs",
  auth(roles.USER_COMPANY_HR),
  jobController.filterJobs
);

router.post(
  "/addApp",
  auth(systemRoles.USER),
  validationMiddleware(addApplicationSchema),
  jobController.applyToJob
);

export default router;
