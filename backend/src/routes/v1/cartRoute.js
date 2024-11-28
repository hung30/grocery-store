import express from "express";
import { cartController } from "~/controllers/cartController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/:userId").delete(
  authMiddleware.isAuthorized,
  cartController.deleteAllProductsInCartByUserId
);
Router.route("/")
  .get(authMiddleware.isAuthorized, cartController.getCartByUserId)
  .post(authMiddleware.isAuthorized, cartController.createNewCart)
  .delete(authMiddleware.isAuthorized, cartController.deleteProductInCart);

export const cartRoute = Router;
