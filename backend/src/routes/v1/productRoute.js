import express from "express";
import { productController } from "~/controllers/productController";
import uploader from "~/middlewares/uploaderMiddleware";

const Router = express.Router();

Router.route("/search").get(productController.findManyBySlug);
Router.route("/:id")
  .get(productController.findOneById)
  .delete(productController.deleteProductById)
  .put(uploader.single("image"), productController.updateProduct);

Router.route("/")
  .post(uploader.single("image"), productController.createNewProduct)
  .get(productController.getAllProducts);

export const productRoute = Router;
