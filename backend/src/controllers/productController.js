import { StatusCodes } from "http-status-codes";
import { productService } from "~/services/productService";
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/formatters";
import fs from "fs";

const createNewProduct = async (req, res, next) => {
  let filePath = null;
  try {
    if (!req.file) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "File không được tải lên");
    }
    filePath = req.file.path;
    const createdProduct = await productService.createNewProduct(
      req.file,
      req.body
    );

    if (!createdProduct) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Tạo sản phẩm thất bại");
    }
    return res.status(StatusCodes.CREATED).json({
      message: "Tạo sản phẩm thành công",
      ...createdProduct,
    });
  } catch (error) {
    next(error);
  } finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
        }
      });
    }
  }
};

const findOneById = async (req, res, next) => {
  try {
    const result = await productService.findOneById(req.params.id);

    if (result) {
      return res.status(StatusCodes.ACCEPTED).json(result);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy sản phẩm nào");
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts();
    if (result.length === 0) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy sản phẩm nào");
    }
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteProductById = async (req, res, next) => {
  try {
    const result = await productService.deleteProductById(req.params.id);
    if (result) {
      return res.status(StatusCodes.OK).json({
        message: "Xóa sản phẩm thành công",
      });
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy sản phẩm");
  } catch (error) {
    next(error);
  }
};

const findManyBySlug = async (req, res, next) => {
  try {
    const searchData = slugify(req.body.name);
    const result = await productService.findManyBySlug(searchData);
    if (result) {
      return res.status(StatusCodes.ACCEPTED).json(result);
    }
    throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy sản phẩm nào");
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  let filePath = null;
  try {
    filePath = req.file.path;
    const updatedProduct = await productService.updateProduct(
      req.params.id,
      req.body,
      req.file
    );

    if (!updatedProduct) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Không tìm thấy sản phẩm nào");
    }

    return res.status(StatusCodes.OK).json({
      message: "Cập nhật sản phẩm thành công",
      ...updatedProduct,
    });
  } catch (error) {
    next(error);
  } finally {
    if (filePath) {
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
        }
      });
    }
  }
};

export const productController = {
  createNewProduct,
  findOneById,
  getAllProducts,
  deleteProductById,
  findManyBySlug,
  updateProduct,
};
