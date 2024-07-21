import Joi from "joi";

export const SignUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(30),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().required(),
    recoveryEmail: Joi.string().email().optional(),
    DOB: Joi.date().optional(),
    mobileNumber: Joi.string().min(10).max(15).required(),
    role: Joi.string().valid("User", "Company_HR").required(),
    status: Joi.string().optional(),
  }).options({ presence: "required" }),
};
