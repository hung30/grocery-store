import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

//define connection schema
const USER_COLLECTION_NAME = "users";
const USER_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  telephone: Joi.string().trim().strict().allow(""),
  name: Joi.string().required().min(1).max(30).trim().strict(),
  password: Joi.string().trim().strict().allow(""),
  address: Joi.string().trim().strict().default(""),
  isAdmin: Joi.boolean().default(false),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateOrUpdateUser = async (data) => {
  return await USER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNewUser = async (data) => {
  try {
    const validateData = await validateBeforeCreateOrUpdateUser(data);

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const updateUserById = async (id, data) => {
  try {
    const { password, createdAt, isAdmin, ...validateData } =
      await validateBeforeCreateOrUpdateUser(data);

    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...validateData, updatedAt: Date.now() } },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ email: email });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUserById = async (id) => {
  try {
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndDelete({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  USER_COLLECTION_NAME,
  USER_SCHEMA,
  createNewUser,
  findOneById,
  updateUserById,
  deleteUserById,
  findOneByEmail,
};
