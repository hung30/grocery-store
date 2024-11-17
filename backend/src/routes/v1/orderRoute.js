import express from "express";
import { orderController } from "~/controllers/orderController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/admin/").get(
  authMiddleware.isAuthorized,
  orderController.getAllOrders
);

Router.route("/:orderId")
  .put(authMiddleware.isAuthorized, orderController.updateOrderStatusById)
  .delete(authMiddleware.isAuthorized, orderController.deleteOrderById);

Router.route("/:userId").get(orderController.getOrdersByUserId);

Router.route("/")
  .post(authMiddleware.isAuthorized, orderController.createNewOrder)
  .get(authMiddleware.isAuthorized, orderController.getOrdersByUserId);

export const orderRoute = Router;
