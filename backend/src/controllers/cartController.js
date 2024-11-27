import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";
import { cartService } from "~/services/cartService";

const createNewCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const productId = req.body.productId;

    const newCart = await cartService.createNewCart(userId, productId);
    if (!newCart) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Tạo giỏ hàng thất bại"
      );
    }
    return res.status(StatusCodes.CREATED).json(newCart);
  } catch (error) {
    next(error);
  }
};

const getCartByUserId = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const cart = await cartService.getCartByUserId(userId);
    return res.status(StatusCodes.OK).json(cart);
  } catch (error) {
    next(error);
  }
};

const deleteProductInCart = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const productId = req.query.productId;

    const deleted = await cartService.deleteProductInCart(userId, productId);
    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Xóa sản phẩm trong giỏ hàng thất bại"
      );
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa sản phẩm trong giỏ hàng thành công" });
  } catch (error) {
    next(error);
  }
};

const deleteAllProductsInCartByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    const deleted = await cartService.deleteAllProductsInCartByUserId(userId);
    if (!deleted) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Xóa tất cả sản phẩm trong giỏ hàng thất bại"
      );
    }
    return res
      .status(StatusCodes.OK)
      .json({ message: "Xóa tất cả sản phẩm trong giỏ hàng thành công" });
  } catch (error) {
    next(error);
  }
};

export const cartController = {
  createNewCart,
  getCartByUserId,
  deleteProductInCart,
  deleteAllProductsInCartByUserId,
};
