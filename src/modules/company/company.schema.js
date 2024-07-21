import Joi from "joi";

export const companySchema = {
  body: Joi.object({
    companyName: Joi.string().required().messages({
      "string.empty": "Company name is required.",
      "any.required": "Company name is required.",
    }),
    description: Joi.string().required().messages({
      "string.empty": "Description is required.",
      "any.required": "Description is required.",
    }),
    industry: Joi.string().required().messages({
      "string.empty": "Industry is required.",
      "any.required": "Industry is required.",
    }),
    address: Joi.string().required().messages({
      "string.empty": "Address is required.",
      "any.required": "Address is required.",
    }),
    numberOfEmployees: Joi.string().valid("11-20").required().messages({
      "string.empty": "Number of employees is required.",
      "any.required": "Number of employees is required.",
      "any.only": "Number of employees must be one of the predefined ranges.",
    }),
    companyEmail: Joi.string().email().required().messages({
      "string.empty": "Company email is required.",
      "any.required": "Company email is required.",
      "string.email": "Company email must be a valid email address.",
    }),
    companyHR: Joi.string().required().messages({
      "string.empty": "Company HR is required.",
      "any.required": "Company HR is required.",
      "string.pattern.base": "Company HR must be a valid MongoDB ObjectId.",
    }),
  }),
};
