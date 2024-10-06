import express from "express";
import { userValidation } from "~/validations/userValidation";
import { userController } from "~/controllers/userController";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { StatusCodes } from "http-status-codes";
import { sendOtpEmail } from "~/utils/mailer";

const Router = express.Router();

Router.get("/", authMiddleware.isAuthorized, (req, res) => {
  res.status(StatusCodes.OK).json({
    message: "aaaaa",
  });
});

Router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = "300403"; // Tạo OTP ngẫu nhiên

  try {
    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "OTP sent successfully", otp }); // Trả về OTP để kiểm tra (trong thực tế, không nên trả về OTP)
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP", error });
  }
});

export const testRoute = Router;
