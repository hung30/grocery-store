import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const CART_COLLECTION_NAME = "carts";
const CART_SCHEMA = Joi.object({
  userId: Joi.object().required(),
  productId: Joi.object().required(),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateCart = async (data) => {
  return await CART_SCHEMA.validateAsync(data, { abortEarly: false });
};

const createNewCart = async (data) => {
  try {
    const validateData = await validateBeforeCreateCart(data);

    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const getCartByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "products",
          },
        },
        { $unwind: "$products" },
      ])
      .toArray();
  } catch (error) {
    throw new Error(error);
  }
};

const findProductInCart = async (userId, productId) => {
  try {
    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .findOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductInCart = async (userId, productId) => {
  try {
    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .deleteOne({
        userId: new ObjectId(userId),
        productId: new ObjectId(productId),
      });
  } catch (error) {
    throw new Error(error);
  }
};

const deleteAllProductsInCartByUserId = async (userId) => {
  try {
    return await GET_DB()
      .collection(CART_COLLECTION_NAME)
      .deleteMany({ userId: new ObjectId(userId) });
  } catch (error) {
    throw new Error(error);
  }
};

export const cartModel = {
  createNewCart,
  getCartByUserId,
  findProductInCart,
  deleteProductInCart,
  deleteAllProductsInCartByUserId,
};
