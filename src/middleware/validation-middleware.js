import { ErrorClass } from "../utils/error-class.utils.js";

const reqKeys = ["body", "query", "params", "headers"];

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];

    for (const key of reqKeys) {
      const validationResult = schema[key]?.validate(req[key], {
        abortEarly: false,
      });

      if (validationResult?.error) {
        validationErrors.push(...validationResult?.error?.details);
      }
    }
    console.log({validationErrors});

    validationErrors.length
      ? next(new ErrorClass("Validation Error", 400, validationErrors))
      : next();
  };
};
