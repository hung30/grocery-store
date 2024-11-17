import { StatusCodes } from "http-status-codes";
import { orderService } from "~/services/orderService";
import ApiError from "~/utils/ApiError";

const createNewOrder = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id;
    const createdOrder = await orderService.createNewOrder(userId, req.body);
    if (!createdOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Tạo đơn hàng thất bại");
    }
    return res.status(StatusCodes.CREATED).json({
      message: "Tạo đơn hàng thành công",
      order: createdOrder,
    });
  } catch (error) {
    next(error);
  }
};

const getOrdersByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orders = await orderService.getOrdersByUserId(userId);
    if (!orders) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");
    }
    return res.status(StatusCodes.OK).json({
      message: "Lấy danh sách đơn hàng thành công",
      orders: orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    if (!orders) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");
    }
    return res.status(StatusCodes.OK).json(orders);
  } catch (error) {
    next(error);
  }
};

const getOneById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getOneById(orderId);
    if (!order) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy đơn hàng");
    }
    return res.status(StatusCodes.OK).json(order);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatusById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const statusId = req.body.statusId;
    const userId = req.jwtDecoded._id;
    const updatedOrder = await orderService.updateOrderStatusById(
      orderId,
      statusId,
      userId
    );
    if (!updatedOrder) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Cập nhật trạng thái đơn hàng thất bại"
      );
    }
    return res.status(StatusCodes.OK).json({
      message: "Cập nhật trạng thái đơn hàng thành công",
      orders: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

const deleteOrderById = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;
    const deletedOrder = await orderService.deleteOrderById(orderId);
    if (!deletedOrder) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Xóa đơn hàng thất bại");
    }
    return res.status(StatusCodes.OK).json({
      message: "Xóa đơn hàng thành công",
      ...deletedOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const orderController = {
  createNewOrder,
  getOrdersByUserId,
  getAllOrders,
  getOneById,
  updateOrderStatusById,
  deleteOrderById,
};
