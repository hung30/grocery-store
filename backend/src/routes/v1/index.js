import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "~/routes/v1/userRoute";
import { testRoute } from "./testRoute";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "aaaaa",
  });
});

Router.use("/test", testRoute);

Router.use("/users", userRoute);

export const APIs_V1 = Router;
