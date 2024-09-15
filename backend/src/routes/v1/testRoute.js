import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { StatusCodes } from "http-status-codes";

const Router = express.Router();

Router.get("/", authMiddleware.isAuthorized, (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "aaaaa",
  });
});

export const testRoute = Router;
