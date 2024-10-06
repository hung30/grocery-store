import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const OTP_COLLECTION_NAME = "otps";
const OTP_SCHEMA = Joi.object({
  userId: Joi.object().required(),
  otp: Joi.string().required().trim().strict(),
  expiredAt: Joi.date()
    .timestamp("javascript")
    .default(() => new Date(Date.now() + 10 * 60 * 1000).getTime()),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateOtp = async (data) => {
  return await OTP_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNewOtp = async (data) => {
  try {
    const validateData = await validateBeforeCreateOtp(data);

    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findLatestOtpByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .findOne({ userId }, { sort: { createdAt: -1 } });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOtpById = async (id) => {
  try {
    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

export const otpModel = {
  createNewOtp,
  findLatestOtpByUserId,
  deleteOtpById,
};
