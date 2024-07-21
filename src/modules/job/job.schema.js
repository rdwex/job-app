import Joi from "joi";

export const jobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid("onsite", "remotely", "hybrid").required(),
    workingTime: Joi.string().valid("part-time", "full-time").required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    addedBy: Joi.string().required(),
  }),
};

export const addApplicationSchema = {
  body: Joi.object({
    jobId: Joi.string().required(),
    userId: Joi.string().required(),
    userTechSkills: Joi.array(),
    userSoftSkills: Joi.array(),
  }),
};
