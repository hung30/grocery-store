import express from "express";
import multer from "multer";
import { productController } from "~/controllers/productController";
const upload = multer({ dest: "public/uploads/" });

const Router = express.Router();

Router.route("/search").get(productController.findManyBySlug);
Router.route("/:id")
  .get(productController.findOneById)
  .delete(productController.deleteProductById)
  .put(upload.single("image"), productController.updateProduct);

Router.route("/")
  .post(upload.single("image"), productController.createNewProduct)
  .get(productController.getAllProducts);

export const productRoute = Router;
