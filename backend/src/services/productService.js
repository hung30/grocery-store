import { StatusCodes } from "http-status-codes";
import { ObjectId } from "mongodb";
import { productModel } from "~/models/productModel";
import ApiError from "~/utils/ApiError";
import { slugify } from "~/utils/formatters";
import cloudinary from "~/config/cloudinaryConfig";

const createNewProduct = async (reqFile, reqBody) => {
  const uploaded = await cloudinary.uploader.upload(reqFile.path, {
    folder: "grocery_store",
  });
  const { public_id, secure_url } = uploaded;

  const newProduct = {
    typeId: new ObjectId(reqBody.typeId),
    name: reqBody.name,
    image: {
      url: secure_url,
      imageId: public_id,
      alt: reqBody.alt,
    },
    price: reqBody.price,
    countInStock: reqBody.countInStock,
    description: reqBody.description,
    slug: slugify(reqBody.name),
  };
  const product = await productModel.findOneBySlug(newProduct.slug);
  if (product) {
    await cloudinary.uploader.destroy(public_id);
    throw new ApiError(StatusCodes.BAD_REQUEST, "Sản phẩm đã tồn tại");
  }
  const createdProduct = await productModel.createNewProduct(newProduct);
  const result = await productModel.findOneById(createdProduct.insertedId);

  return result;
};

const findOneById = async (id) => {
  try {
    return await productModel.findOneById(id);
  } catch (error) {
    throw new Error(error);
  }
};

const getAllProducts = async () => {
  try {
    return await productModel.getAllProducts();
  } catch (error) {
    throw new Error(error);
  }
};

const deleteProductById = async (id) => {
  const product = await productModel.findOneById(id);
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
  }

  if (product.image.imageId) {
    await cloudinary.uploader.destroy(product.image.imageId);
  }

  return await productModel.deleteProductById(id);
};

const findManyBySlug = async (name) => {
  try {
    return await productModel.findManyBySlug(name);
  } catch (error) {
    throw new Error(error);
  }
};

const updateProduct = async (id, reqBody, reqFile) => {
  const { _id, type, createdAt, updatedAt, ...product } =
    await productModel.findOneById(id);
  const { alt, ...reqBodyWithoutAlt } = reqBody;
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Sản phẩm không tồn tại");
  }

  const isSlugExist = await productModel.findOneBySlug(slugify(reqBody.name));
  if (isSlugExist && isSlugExist._id.toString() !== id) {
    throw new ApiError(StatusCodes.BAD_REQUEST, `${product.name} đã tồn tại`);
  }

  const updatedProductData = {
    ...product,
    ...reqBodyWithoutAlt,
    typeId: new ObjectId(reqBody.typeId),
  };

  if (reqFile) {
    // Xóa ảnh cũ từ Cloudinary nếu có
    if (product.image.imageId) {
      await cloudinary.uploader.destroy(product.image.imageId);
    }

    // Upload ảnh mới lên Cloudinary
    const uploaded = await cloudinary.uploader.upload(reqFile.path, {
      folder: "grocery_store",
    });

    const { public_id, secure_url } = uploaded;

    // Cập nhật ảnh mới
    updatedProductData.image = {
      url: secure_url,
      imageId: public_id,
      alt: reqBody.alt,
    };
  }

  await productModel.updateProductById(id, updatedProductData);
  return await productModel.findOneById(id);
};

export const productService = {
  createNewProduct,
  findOneById,
  getAllProducts,
  deleteProductById,
  findManyBySlug,
  updateProduct,
};
