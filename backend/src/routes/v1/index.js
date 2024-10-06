import express from "express";
import { StatusCodes } from "http-status-codes";
import { userRoute } from "~/routes/v1/userRoute";
import { testRoute } from "./testRoute";
import { authGoogle } from "./authGoogle";
import { typeRoute } from "./typeRoute";
import { productRoute } from "./productRoute";
import { otpRoute } from "./otpRoute";

const Router = express.Router();

Router.get("/", (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "aaaaa",
  });
});

Router.use("/test", testRoute);

Router.use("/users", userRoute);

Router.use("/auth-google", authGoogle);

Router.use("/types", typeRoute);

Router.use("/products", productRoute);

Router.use("/otp", otpRoute);

export const APIs_V1 = Router;
