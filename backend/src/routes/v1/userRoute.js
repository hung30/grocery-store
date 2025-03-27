import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";
import { otpMiddleware } from "~/middlewares/otpMiddleware";
import { authMiddleware } from "~/middlewares/authMiddleware";

const Router = express.Router();

Router.route("/login").post(userController.login);
Router.route("/logout").delete(userController.logout);
Router.route("/reset-password").put(
  otpMiddleware.isVerifiedOtp,
  userController.resetPasswordById
);
Router.route("/send-contact-email").post(userController.sendContactEmail);
Router.route("/refresh-token").put(userController.refreshToken);

Router.route("/:id")
  .get(authMiddleware.isAuthorized, userController.getOneUserById)
  .put(
    authMiddleware.isAuthorized,
    userValidation.updatedById,
    userController.updateUserById
  )
  .delete(authMiddleware.isAuthorized, userController.deleteUserById);

Router.route("/")
  .get(authMiddleware.isAuthorized, userController.getAllUsers)
  .post(userValidation.createNew, userController.createNew);

export const userRoute = Router;
