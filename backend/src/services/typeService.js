import { StatusCodes } from "http-status-codes";
import { typeModel } from "~/models/typeModel";
import ApiError from "~/utils/ApiError";

const createNewType = async (data) => {
  try {
    const newType = {
      name: data.name[0].toUpperCase() + data.name.slice(1),
    };
    const compareType = await typeModel.findOneByName(newType.name);
    if (compareType) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Danh mục đã tồn tại");
    }
    const createdType = await typeModel.createNewType(newType);
    const result = await typeModel.findOneById(createdType.insertedId);
    return result;
  } catch (error) {
    throw error;
  }
};

const getAllTypes = async () => {
  try {
    const result = await typeModel.getAllTypes();
    return result;
  } catch (error) {
    throw error;
  }
};

const getOneById = async (id) => {
  try {
    return await typeModel.findOneById(id);
  } catch (error) {
    throw error;
  }
};

const updateTypeById = async (id, data) => {
  try {
    const updateData = {
      name: data.name[0].toUpperCase() + data.name.slice(1),
    };

    const compareData = await typeModel.findOneByName(updateData.name);
    if (compareData) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Tên danh mục đã tồn tại");
    }
    const updatedType = await typeModel.updateTypeById(id, updateData);
    if (updatedType) {
      return updatedType;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteTypeById = async (id) => {
  try {
    return await typeModel.deleteTypeById(id);
  } catch (error) {
    throw error;
  }
};

export const typeService = {
  createNewType,
  getAllTypes,
  getOneById,
  updateTypeById,
  deleteTypeById,
};
