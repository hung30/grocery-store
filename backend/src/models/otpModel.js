import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const OTP_COLLECTION_NAME = "otps";
const OTP_SCHEMA = Joi.object({
  userId: Joi.object(),
  otp: Joi.string().required().trim().strict(),
  email: Joi.string().email().trim().strict(),
  expiredAt: Joi.date()
    .timestamp("javascript")
    .default(() => new Date(Date.now() + 10 * 60 * 1000).getTime()),
  expiredAtByDate: Joi.date()
    .timestamp("javascript")
    .default(() => new Date(Date.now() + 60 * 60 * 1000)),
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
      .findOne({ userId: userId }, { sort: { createdAt: -1 } });
  } catch (error) {
    throw new Error(error);
  }
};

const findLatestOtpByEmail = async (email) => {
  try {
    return await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .findOne({ email: email }, { sort: { createdAt: -1 } });
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

const createTTLIndexForDeleteOtpExpired = async () => {
  try {
    await GET_DB()
      .collection(OTP_COLLECTION_NAME)
      .createIndex({ expiredAtByDate: 1 }, { expireAfterSeconds: 0 });
  } catch (error) {
    throw new Error(error);
  }
};

export const otpModel = {
  createNewOtp,
  findLatestOtpByUserId,
  findLatestOtpByEmail,
  deleteOtpById,
  createTTLIndexForDeleteOtpExpired,
};
