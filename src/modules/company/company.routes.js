import { Router } from "express";
import * as companyController from "./company.controller.js";
import { auth } from "../../middleware/auth.middleware.js";
import { companySchema } from "./company.schema.js";
import { validationMiddleware } from "../../middleware/validation-middleware.js";
import { roles } from "../../utils/system-roles.js";

const router = Router();

router.post(
  "/add",
  validationMiddleware(companySchema),
  auth(roles.COMPANY_HR),
  companyController.createCompany
);

router.put(
  "/update/:_id",
  auth(roles.COMPANY_HR),
  companyController.updateCompany
);

router.get("/list", companyController.getCompany);
router.get("/get-one", companyController.getOneCompany);
router.get("/search/:name", companyController.getOneCompany);
router.get(
  "/application/:id",
  auth(roles.COMPANY_HR),
  companyController.getOneCompany
);

router.delete("/delete/:_id", companyController.deleteCompany);

router.get(
  "/export/:companyId/:date",
  auth(roles.COMPANY_HR),
  companyController.getOneCompany
);

export default router;
