import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";
import { otpMiddleware } from "~/middlewares/otpMiddleware";

const Router = express.Router();

Router.route("/login").post(userController.login);
Router.route("/logout").delete(userController.logout);
Router.route("/reset-password").put(
  otpMiddleware.isVerifiedOtp,
  userController.resetPasswordById
);
Router.route("/refresh-token").put(userController.refreshToken);

Router.route("/:id")
  .get(userController.getOneUserById)
  .put(userValidation.updatedById, userController.updateUserById)
  .delete(userController.deleteUserById);

Router.route("/").post(userValidation.createNew, userController.createNew);

export const userRoute = Router;
