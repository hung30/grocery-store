import express from "express";
import { cartController } from "~/controllers/cartController";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/:userId")
  .get(cartController.getCartByUserId)
  .delete(
    authMiddleware.isAuthorized,
    cartController.deleteAllProductsInCartByUserId
  );
Router.route("/")
  .post(authMiddleware.isAuthorized, cartController.createNewCart)
  .delete(authMiddleware.isAuthorized, cartController.deleteProductInCart);

export const cartRoute = Router;
