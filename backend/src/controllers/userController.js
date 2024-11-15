import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";
import ms from "ms";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";

const getOneUserById = async (req, res, next) => {
  try {
    const result = await userService.getOneUserById(req.params.id);
    if (result) {
      return res.status(StatusCodes.ACCEPTED).json(result);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy user");
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdUser = await userService.createNew(req.body);

    if (!createdUser) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Email hoặc số điện thoại đã tồn tại"
      );
    }
    // có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json({
      message: "Tạo user thành công",
      ...createdUser,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserById = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserById(
      req.params.id,
      req.body
    );
    if (updatedUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Cập nhật user thành công", ...updatedUser });
    }

    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy user");
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const deletedUser = await userService.deleteUserById(req.params.id);
    if (deletedUser) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Xoá user thành công" });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy user");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);
    if (!result) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Tài khoản hoặc mật khẩu không chính xác"
      );
    }

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    }),
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("14 days"),
      });

    return res
      .status(StatusCodes.OK)
      .json({ message: "Đăng nhập thành công", ...result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken", {
      path: "/",
      domain:
        env.BUILD_MODE === "production"
          ? "grocery-store-jade-ten.vercel.app"
          : "localhost",
    });
    res.clearCookie("refreshToken", {
      path: "/",
      domain:
        env.BUILD_MODE === "production"
          ? "grocery-store-jade-ten.vercel.app"
          : "localhost",
    });
    return res.status(StatusCodes.OK).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    const refreshTokenDecoded = await JwtProvider.verifyToken(
      refreshToken,
      env.REFRESH_TOKEN_PRIVATE_KEY
    );
    const { iat, exp, ...userInfo } = refreshTokenDecoded;
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      "5m"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res
      .status(StatusCodes.OK)
      .json({ message: "Làm mới token thành công", accessToken });
  } catch (error) {
    next(error);
  }
};

const resetPasswordById = async (req, res, next) => {
  try {
    const result = await userService.resetPasswordById(req.userId, req.body);
    if (result) {
      return res.status(StatusCodes.OK).json({
        message: "Đổi mật khẩu thành công",
      });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy user");
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  getOneUserById,
  updateUserById,
  deleteUserById,
  login,
  logout,
  refreshToken,
  resetPasswordById,
};
