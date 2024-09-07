import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
    telephone: Joi.string().required().min(10).max(10).trim().strict(),
    name: Joi.string().required().min(1).max(30).trim().strict(),
    password: Joi.string()
      .required()
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$"))
      .trim()
      .strict()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one special character and one number, with a minimum length of 6 characters",
      }),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

const updatedById = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict(),
    telephone: Joi.string().required().min(10).max(10).trim().strict(),
    name: Joi.string().required().min(1).max(30).trim().strict(),
    address: Joi.string().trim().strict().default(""),
  });
  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    );
  }
};

export const userValidation = {
  createNew,
  updatedById,
};
