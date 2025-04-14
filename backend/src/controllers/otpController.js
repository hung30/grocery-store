import ApiError from "~/utils/ApiError";
const { StatusCodes } = require("http-status-codes");
const { otpService } = require("~/services/otpService");

const sendOtp = async (req, res, next) => {
  try {
    const sendOtp = await otpService.sendOtp(req.body);
    if (sendOtp) {
      return res.status(StatusCodes.OK).json({
        message: sendOtp,
      });
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, "Gửi mã OTP thất bại");
  } catch (error) {
    next(error);
  }
};

const sendOtpToRegister = async (req, res, next) => {
  try {
    const sendOtp = await otpService.sendOtpToRegister(req.body);
    if (sendOtp) {
      return res.status(StatusCodes.OK).json({
        message: sendOtp,
      });
    }
    throw new ApiError(StatusCodes.BAD_REQUEST, "Gửi mã OTP thất bại");
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const verifyOtp = await otpService.verifyOtp(req.body);
    if (!verifyOtp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Xác thực mã OTP thất bại");
    }
    return res.status(StatusCodes.OK).json({
      message: "Xác thực mã OTP thành công",
      verifyOtp,
    });
  } catch (error) {
    next(error);
  }
};

const verifyOtpToRegister = async (req, res, next) => {
  try {
    const verifyOtp = await otpService.verifyOtpToRegister(req.body);
    if (!verifyOtp) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Xác thực mã OTP thất bại");
    }
    return res.status(StatusCodes.OK).json({
      message: "Xác thực mã OTP thành công",
      verifyOtp,
    });
  } catch (error) {
    next(error);
  }
};

export const otpController = {
  sendOtp,
  sendOtpToRegister,
  verifyOtpToRegister,
  verifyOtp,
};
