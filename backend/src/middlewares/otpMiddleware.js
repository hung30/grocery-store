import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";
import ApiError from "~/utils/ApiError";

const isVerifiedOtp = async (req, res, next) => {
  try {
    if (req.body.userId) {
      req.userId = req.body.userId;
      return next();
    }
    const token = req.headers["authorization"];
    if (!token) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Chưa xác thực otp");
    }
    const verifiedToken = await JwtProvider.verifyToken(
      token,
      env.REFRESH_TOKEN_PRIVATE_KEY
    );
    if (!verifiedToken) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Xác thực otp thất bại");
    }
    req.userId = verifiedToken.user;
    next();
  } catch (error) {
    if (error.message === "TokenExpiredError: jwt expired") {
      next(
        new ApiError(StatusCodes.BAD_REQUEST, "Otp đã hết hạn vui lòng thử lại")
      );
    } else {
      next(error);
    }
  }
};

export const otpMiddleware = {
  isVerifiedOtp,
};
