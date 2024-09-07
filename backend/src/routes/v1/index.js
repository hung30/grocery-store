import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "~/routes/v1/userRoute";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "aaaaa",
  });
});

Router.use("/users", userRoute);

export const APIs_V1 = Router;
