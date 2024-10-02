import Joi from "joi";
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";

const TYPE_COLLECTION_NAME = "types";
const TYPE_SCHEMA = Joi.object({
  name: Joi.string().required().min(1).max(30).trim().strict(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateOrUpdateType = async (data) => {
  return await TYPE_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNewType = async (data) => {
  try {
    const validateData = await validateBeforeCreateOrUpdateType(data);

    return await GET_DB()
      .collection(TYPE_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    return await GET_DB()
      .collection(TYPE_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByName = async (name) => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME).findOne({ name });
  } catch (error) {
    throw new Error(error);
  }
};

const getAllTypes = async () => {
  try {
    return await GET_DB().collection(TYPE_COLLECTION_NAME).find().toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const updateTypeById = async (id, data) => {
  try {
    const { createdAt, ...validateData } =
      await validateBeforeCreateOrUpdateType(data);

    return await GET_DB()
      .collection(TYPE_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...validateData, updatedAt: Date.now() } },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const deleteTypeById = async (id) => {
  try {
    return await GET_DB()
      .collection(TYPE_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

export const typeModel = {
  createNewType,
  findOneById,
  findOneByName,
  getAllTypes,
  updateTypeById,
  deleteTypeById,
};
