import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { otpModel } from "~/models/otpModel";
import { userModel } from "~/models/userModel";
import { JwtProvider } from "~/providers/JwtProvider";
import ApiError from "~/utils/ApiError";
import { Bcrypt } from "~/utils/bcrypt";
import { generateOtp } from "~/utils/generateOtp";
import { sendOtpEmail } from "~/utils/mailer";
import { verify } from "jsonwebtoken";

const sendOtp = async (reqBody) => {
  try {
    const { email } = reqBody;
    const user = await userModel.findOneByEmail(email);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Email không chính xác");
    }

    const otp = generateOtp();
    const data = {
      userId: user._id,
      otp: await Bcrypt.hashData(otp),
    };
    await otpModel.createNewOtp(data);
    await sendOtpEmail(email, otp);
    return "Gửi mã OTP thành công";
  } catch (error) {
    throw error;
  }
};

const sendOtpToRegister = async (reqBody) => {
  try {
    const { email } = reqBody;
    const user = await userModel.findOneByEmail(email);
    if (user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Email đã đăng ký");
    }

    const otp = generateOtp();
    const data = {
      email: email,
      otp: await Bcrypt.hashData(otp),
    };
    await otpModel.createNewOtp(data);
    await sendOtpEmail(email, otp);
    return "Gửi mã OTP thành công";
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async (reqBody) => {
  try {
    const { email, otp } = reqBody;
    const user = await userModel.findOneByEmail(email);
    const otpRecord = await otpModel.findLatestOtpByUserId(user._id);
    if (!otpRecord) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy mã OTP");
    }
    const isMatch = await Bcrypt.compareData(otp, otpRecord.otp);
    if (!isMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Mã OTP không chính xác");
    }
    if (otpRecord.expiredAt < new Date()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Mã OTP đã hết hạn");
    }
    await otpModel.deleteOtpById(otpRecord._id);
    const token = JwtProvider.generateToken(
      { user: user._id },
      env.REFRESH_TOKEN_PRIVATE_KEY,
      "10 minutes"
    );
    return token;
  } catch (error) {
    throw error;
  }
};

const verifyOtpToRegister = async (reqBody) => {
  try {
    const { email, otp } = reqBody;
    const otpRecord = await otpModel.findLatestOtpByEmail(email);
    if (!otpRecord) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy mã OTP");
    }
    const isMatch = await Bcrypt.compareData(otp, otpRecord.otp);
    if (!isMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Mã OTP không chính xác");
    }
    if (otpRecord.expiredAt < new Date()) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Mã OTP đã hết hạn");
    }
    await otpModel.deleteOtpById(otpRecord._id);
    return "Xác thực mã OTP thành công";
  } catch (error) {
    throw error;
  }
};

export const otpService = {
  sendOtp,
  sendOtpToRegister,
  verifyOtp,
  verifyOtpToRegister,
};
