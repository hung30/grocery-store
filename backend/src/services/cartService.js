import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
import { ObjectId } from "mongodb";
import { cartModel } from "~/models/cartModel";

const createNewCart = async (userId, productId) => {
  try {
    const s = await cartModel.findProductInCart(userId, productId);
    if (s) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Sản phẩm đã tồn tại trong giỏ hàng"
      );
    }
    const data = {
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    };
    const createdCart = await cartModel.createNewCart(data);
    return createdCart;
  } catch (error) {
    throw new Error(error);
  }
};

const getCartByUserId = async (userId) => {
  try {
    return await cartModel.getCartByUserId(userId);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductInCart = async (userId, productId) => {
  try {
    return await cartModel.deleteProductInCart(userId, productId);
  } catch (error) {
    throw new Error(error);
  }
};

export const cartService = {
  createNewCart,
  getCartByUserId,
  deleteProductInCart,
};
