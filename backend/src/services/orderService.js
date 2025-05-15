import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { orderModel } from "~/models/orderModel";
import { productModel } from "~/models/productModel";
import { userModel } from "~/models/userModel";
import ApiError from "~/utils/ApiError";
import { sendOrderStatusEmail } from "~/utils/mailer";

const createNewOrder = async (userId, reqBody) => {
  try {
    reqBody.items = reqBody.items.map((item) => ({
      ...item,
      productId: new ObjectId(item.productId),
    }));
    const { items } = reqBody;
    for (const item of items) {
      const product = await productModel.findOneById(item.productId);
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
      }
      if (parseFloat(item.quantity) > parseFloat(product.countInStock)) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Số lượng sản phẩm trong kho không đủ"
        );
      }
    }
    // for (const item of items) {
    //   const product = await productModel.findOneById(item.productId);
    //   const newConstInStock =
    //     parseFloat(product.countInStock) - parseFloat(item.quantity);
    //   await productModel.updateCountInStock(
    //     item.productId,
    //     newConstInStock.toString()
    //   );
    // }
    const data = {
      userId: new ObjectId(userId),
      ...reqBody,
    };
    const createdOrder = await orderModel.createNewOrder(data);
    return await orderModel.getOneById(createdOrder.insertedId);
  } catch (error) {
    throw new Error(error);
  }
};

const createNewOrderForOnlinePayment = async (userId, reqBody) => {
  try {
    reqBody.items = reqBody.items.map((item) => ({
      ...item,
      productId: new ObjectId(item.productId),
    }));
    const { items } = reqBody;
    for (const item of items) {
      const product = await productModel.findOneById(item.productId);
      if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
      }
      if (parseFloat(item.quantity) > parseFloat(product.countInStock)) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          "Số lượng sản phẩm trong kho không đủ"
        );
      }
    }

    const data = {
      userId: new ObjectId(userId),
      ...reqBody,
    };
    const createdOrder = await orderModel.createNewOrderForOnlinePayment(data);
    return await orderModel.getOneById(createdOrder.insertedId);
  } catch (error) {
    throw new Error(error);
  }
};

const getOrdersByUserId = async (userId) => {
  try {
    return await orderModel.getOrdersByUserId(userId);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllOrders = async () => {
  try {
    return await orderModel.getAllOrders();
  } catch (error) {
    throw new Error(error);
  }
};

const getOneById = async (id) => {
  try {
    return await orderModel.getOneById(id);
  } catch (error) {
    throw new Error(error);
  }
};

const updateOrderStatusById = async (id, statusId, userId) => {
  try {
    if (id) {
      const order = await orderModel.getOneById(id);
      if (
        order.statusInfo[0]._id.toString() === "67321305f823c69a6e65659f" &&
        statusId !== "67321305f823c69a6e65659f" &&
        statusId === "67321261f823c69a6e65659c"
      ) {
        for (const item of order.items) {
          const product = await productModel.findOneById(item.productId);
          const newCountInStock =
            parseFloat(product.countInStock) - parseFloat(item.quantity);
          if (newCountInStock < 0) {
            throw new ApiError(
              StatusCodes.BAD_REQUEST,
              "Số lượng sản phẩm trong kho không đủ"
            );
          }
          await productModel.updateCountInStock(
            item.productId,
            newCountInStock.toString()
          );
        }
      } else if (
        statusId === "67321305f823c69a6e65659f" &&
        order.statusInfo[0]._id.toString() !== "67321261f823c69a6e65659b" &&
        order.statusInfo[0]._id.toString() !== "6824b479efd1eaef703746da"
      ) {
        for (const item of order.items) {
          const product = await productModel.findOneById(item.productId);
          const newCountInStock =
            parseFloat(product.countInStock) + parseFloat(item.quantity);
          await productModel.updateCountInStock(
            item.productId,
            newCountInStock.toString()
          );
        }
      } else if (statusId === "673212a4f823c69a6e65659c") {
        const order = await orderModel.getOneById(id);
        for (const item of order.items) {
          const product = await productModel.findOneById(item.productId);
          const newCountInStock =
            parseFloat(product.countInStock) - parseFloat(item.quantity);
          if (newCountInStock < 0) {
            throw new ApiError(
              StatusCodes.BAD_REQUEST,
              "Số lượng sản phẩm trong kho không đủ"
            );
          }
          await productModel.updateCountInStock(
            item.productId,
            newCountInStock.toString()
          );
        }
      }
    }

    await orderModel.updateOrderStatusById(id, statusId);
    const order = await orderModel.getOneById(id);
    const user = await userModel.findOneById(order.userId);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại");
    }

    await sendOrderStatusEmail(user.email, id, statusId);

    return await orderModel.getOrdersByUserId(order.userId);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOrderById = async (id) => {
  try {
    return await orderModel.deleteOrderById(id);
  } catch (error) {
    throw new Error(error);
  }
};

export const orderService = {
  createNewOrder,
  createNewOrderForOnlinePayment,
  getOrdersByUserId,
  getAllOrders,
  getOneById,
  updateOrderStatusById,
  deleteOrderById,
};
