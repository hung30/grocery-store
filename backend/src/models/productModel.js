import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const PRODUCT_COLLECTION_NAME = "products";
const PRODUCT_SCHEMA = Joi.object({
  typeId: Joi.object().required(),
  name: Joi.string().required().min(1).max(30).trim().strict(),
  image: Joi.object({
    url: Joi.string().required().trim().strict(),
    imageId: Joi.string().required().trim().strict(),
    alt: Joi.string().required().trim().strict(),
  }),
  price: Joi.string().required().trim().strict(),
  countInStock: Joi.string().required().strict(),
  description: Joi.string().required().min(1).max(255).trim().strict(),
  slug: Joi.string().required().min(1).trim().strict(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateOrUpdateProduct = async (data) => {
  return await PRODUCT_SCHEMA.validateAsync(data, { abortEarly: false });
};

const findOneBySlug = async (slug) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .findOne({ slug: slug });
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "types",
            localField: "typeId",
            foreignField: "_id",
            as: "type",
          },
        },
        { $unwind: "$type" },
        {
          $project: {
            name: 1,
            image: 1,
            price: 1,
            countInStock: 1,
            description: 1,
            slug: 1,
            createAt: 1,
            updatedAt: 1,
            "type.name": 1,
          },
        },
      ])
      .toArray();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProducts = async () => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: "types",
            localField: "typeId",
            foreignField: "_id",
            as: "type",
          },
        },
        { $unwind: "$type" },
        {
          $project: {
            name: 1,
            image: 1,
            price: 1,
            countInStock: 1,
            description: 1,
            slug: 1,
            createAt: 1,
            updatedAt: 1,
            "type.name": 1,
          },
        },
      ])
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const createNewProduct = async (data) => {
  try {
    const validateData = await validateBeforeCreateOrUpdateProduct(data);

    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductById = async (id) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const findManyBySlug = async (slug) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .find({ slug: { $regex: slug, $options: "i" } })
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const updateProductById = async (id, data) => {
  try {
    const { createdAt, ...validateData } =
      await validateBeforeCreateOrUpdateProduct(data);

    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...validateData, updatedAt: Date.now() } }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const updateCountInStock = async (id, newCountInStock) => {
  try {
    return await GET_DB()
      .collection(PRODUCT_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            countInStock: newCountInStock,
            updatedAt: Date.now(),
          },
        }
      );
  } catch (error) {
    throw new Error(error);
  }
};

export const productModel = {
  findOneBySlug,
  findOneById,
  createNewProduct,
  getAllProducts,
  deleteProductById,
  findManyBySlug,
  updateProductById,
  updateCountInStock,
};
