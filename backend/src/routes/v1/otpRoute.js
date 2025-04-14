import express from "express";
import { otpController } from "~/controllers/otpController";

const Router = express.Router();

Router.route("/send-otp").post(otpController.sendOtp);
Router.route("/send-otp-to-register").post(otpController.sendOtpToRegister);
Router.route("/verify-otp-to-register").post(otpController.verifyOtpToRegister);
Router.route("/verify-otp").post(otpController.verifyOtp);

export const otpRoute = Router;
