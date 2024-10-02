import { StatusCodes } from "http-status-codes";
import { typeService } from "~/services/typeService";
import ApiError from "~/utils/ApiError";

const createNewType = async (req, res, next) => {
  try {
    const createdType = await typeService.createNewType(req.body);
    if (!createdType) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Tạo danh mục thất bại!");
    }
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Tạo danh mục thành công", ...createdType });
  } catch (error) {
    next(error);
  }
};

const getAllTypes = async (req, res, next) => {
  try {
    const types = await typeService.getAllTypes();
    if (types) {
      return res.status(StatusCodes.OK).json(types);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy danh mục");
  } catch (error) {
    next(error);
  }
};

const getTypeById = async (req, res, next) => {
  try {
    const type = await typeService.getOneById(req.params.id);
    if (type) {
      return res.status(StatusCodes.OK).json(type);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy danh mục");
  } catch (error) {
    next(error);
  }
};

const updateTypeById = async (req, res, next) => {
  try {
    const updatedType = await typeService.updateTypeById(
      req.params.id,
      req.body
    );
    if (updatedType) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Cập nhật danh mục thành công", ...updatedType });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy danh mục");
  } catch (error) {
    next(error);
  }
};

const deleteTypeById = async (req, res, next) => {
  try {
    const deletedType = await typeService.deleteTypeById(req.params.id);
    if (deletedType) {
      return res
        .status(StatusCodes.OK)
        .json({ message: "Xoá danh mục thành công" });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy danh mục");
  } catch (error) {
    next(error);
  }
};

export const typeController = {
  createNewType,
  getAllTypes,
  getTypeById,
  updateTypeById,
  deleteTypeById,
};
