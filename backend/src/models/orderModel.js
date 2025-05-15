import Joi from "joi";
import { ObjectId } from "mongodb";
import { GET_DB } from "~/config/mongodb";

const ORDER_COLLECTION_NAME = "orders";
const ORDER_SCHEMA = Joi.object({
  nameOrder: Joi.string().required().min(1).max(100).trim().strict(),
  userId: Joi.object().required(),
  userInfo: Joi.object({
    name: Joi.string().required().min(1).max(30).trim().strict(),
    telephone: Joi.string()
      .trim()
      .strict()
      .pattern(/^[0-9]{10}$/)
      .required(),
    address: Joi.string().required().min(1).max(255).trim().strict(),
  }),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.object().required(),
      quantity: Joi.string().required().min(1).strict(),
    })
  ),
  totalPrice: Joi.string().required().min(0).strict(),
  statusId: Joi.object().default(new ObjectId("67321261f823c69a6e65659b")),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const ORDER_SCHEMA_FOR_ONLINE_PAYMENT = Joi.object({
  nameOrder: Joi.string().required().min(1).max(100).trim().strict(),
  userId: Joi.object().required(),
  userInfo: Joi.object({
    name: Joi.string().required().min(1).max(30).trim().strict(),
    telephone: Joi.string()
      .trim()
      .strict()
      .pattern(/^[0-9]{10}$/)
      .required(),
    address: Joi.string().required().min(1).max(255).trim().strict(),
  }),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.object().required(),
      quantity: Joi.string().required().min(1).strict(),
    })
  ),
  totalPrice: Joi.string().required().min(0).strict(),
  statusId: Joi.object().default(new ObjectId("6824b479efd1eaef703746da")),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
});

const validateBeforeCreateOrder = async (data) => {
  return await ORDER_SCHEMA.validateAsync(data, { abortEarly: false });
};

const validateBeforeCreateOrderForOnlinePayment = async (data) => {
  return await ORDER_SCHEMA_FOR_ONLINE_PAYMENT.validateAsync(data, {
    abortEarly: false,
  });
};

const createNewOrder = async (data) => {
  try {
    const validateData = await validateBeforeCreateOrder(data);

    return await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const createNewOrderForOnlinePayment = async (data) => {
  try {
    const validateData = await validateBeforeCreateOrderForOnlinePayment(data);

    return await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const getOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: "status",
            localField: "statusId",
            foreignField: "_id",
            as: "statusInfo",
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        {
          $group: {
            _id: "$_id",
            nameOrder: { $first: "$nameOrder" },
            userId: { $first: "$userId" },
            userInfo: { $first: "$userInfo" },
            items: {
              $push: {
                productId: "$items.productId",
                quantity: "$items.quantity",
                productInfo: "$productInfo",
              },
            },
            totalPrice: { $first: "$totalPrice" },
            statusInfo: { $first: "$statusInfo" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ])
      .toArray();
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrders = async () => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: "status",
            localField: "statusId",
            foreignField: "_id",
            as: "statusInfo",
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$_id",
            nameOrder: { $first: "$nameOrder" },
            userInfo: { $first: "$userInfo" },
            items: {
              $push: {
                productId: "$items.productId",
                quantity: "$items.quantity",
                productInfo: "$productInfo",
              },
            },
            totalPrice: { $first: "$totalPrice" },
            statusInfo: { $first: "$statusInfo" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getExpiredOrders = async () => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .find({
        statusId: new ObjectId("6824b479efd1eaef703746da"),
        createdAt: { $lt: Date.now() - 15 * 60 * 1000 },
      })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .aggregate([
        { $match: { userId: new ObjectId(userId) } },
        {
          $lookup: {
            from: "status",
            localField: "statusId",
            foreignField: "_id",
            as: "statusInfo",
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: "$productInfo" },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: "$_id",
            nameOrder: { $first: "$nameOrder" },
            userInfo: { $first: "$userInfo" },
            items: {
              $push: {
                productId: "$items.productId",
                quantity: "$items.quantity",
                productInfo: "$productInfo",
              },
            },
            totalPrice: { $first: "$totalPrice" },
            statusInfo: { $first: "$statusInfo" },
            createdAt: { $first: "$createdAt" },
            updatedAt: { $first: "$updatedAt" },
          },
        },
        { $sort: { createdAt: -1 } },
      ])
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOrderStatusById = async (id, statusId) => {
  try {
    return await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { statusId: new ObjectId(statusId), updatedAt: Date.now() } }
      );
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOrderById = async (id) => {
  try {
    return await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(id) });
  } catch (error) {
    throw new Error(error);
  }
};

const getOrderByOrderId = async (orderId) => {
  try {
    return await GET_DB()
      .collection(ORDER_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(orderId) });
  } catch (error) {
    throw new Error(error);
  }
};

export const orderModel = {
  createNewOrder,
  createNewOrderForOnlinePayment,
  getOneById,
  getAllOrders,
  getOrdersByUserId,
  getExpiredOrders,
  updateOrderStatusById,
  deleteOrderById,
  getOrderByOrderId,
};
