import { StatusCodes } from "http-status-codes";
import { userService } from "~/services/userService";
import ApiError from "~/utils/ApiError";

const getOneUserById = async (req, res, next) => {
  try {
    const result = await userService.getOneUserById(req.params.id);
    if (result) {
      return res.status(StatusCodes.ACCEPTED).json(result);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  } catch (error) {
    next(error);
  }
};

const createNew = async (req, res, next) => {
  try {
    // điều hướng dữ liệu sang tầng service
    const createdUser = await userService.createNew(req.body);
    // có kết quả thì trả về phía client
    res.status(StatusCodes.CREATED).json(createdUser);
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
        .json({ message: "User updated successfully", ...updatedUser });
    }

    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
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
        .json({ message: "User deleted successfully" });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  } catch (error) {
    next(error);
  }
};

export const userController = {
  createNew,
  getOneUserById,
  updateUserById,
  deleteUserById,
};
