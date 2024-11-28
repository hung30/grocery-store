import { Bcrypt } from "~/utils/bcrypt";
import { userModel } from "~/models/userModel";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";
import { StatusCodes } from "http-status-codes";
import ApiError from "~/utils/ApiError";
const createNew = async (reqBody) => {
  try {
    const newUser = {
      ...reqBody,
      password: await Bcrypt.hashData(reqBody.password),
    };

    const user = await userModel.findOneByEmailOrPhone(
      reqBody.email,
      reqBody.telephone
    );
    if (user) {
      return "";
    }

    const createdUser = await userModel.createNewUser(newUser);
    const result = await userModel.findOneById(createdUser.insertedId);

    return result;
  } catch (error) {
    throw error;
  }
};

const getOneUserById = async (id) => {
  try {
    return await userModel.findOneById(id);
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (id, data) => {
  try {
    const user = await userModel.findUserByPhone(id, data.telephone);
    if (user) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Số điện thoại đã tồn tại");
    }

    const updatedUser = await userModel.updateUserById(id, data);
    if (updatedUser) {
      const { password, ...result } = updatedUser;
      return result;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    return await userModel.deleteUserById(id);
  } catch (error) {
    throw error;
  }
};

const login = async (reqBody) => {
  try {
    const user = await userModel.findOneByEmail(reqBody.email);
    if (!user) {
      return false;
    }
    const comparePassword = await Bcrypt.compareData(
      reqBody.password,
      user.password
    );
    if (!comparePassword) {
      return false;
    }

    const isPasswordEmpty = user.password === "" ? true : false;
    const userInfo = {
      _id: user._id,
      email: user.email,
      name: user.name,
      telephone: user.telephone,
      address: user.address,
      isAdmin: user.isAdmin,
      isPasswordEmpty: isPasswordEmpty,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      "5m"
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      "14 days"
    );
    return { userInfo, accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const resetPasswordById = async (id, reqBody) => {
  try {
    const user = await userModel.findOneById(id);
    if (!user) {
      return false;
    }
    const newPassword = await Bcrypt.hashData(reqBody.password);
    const updatedUser = await userModel.updatePasswordById(id, newPassword);
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async () => {
  try {
    return await userModel.getAllUsers();
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  getOneUserById,
  updateUserById,
  deleteUserById,
  login,
  resetPasswordById,
  getAllUsers,
};
