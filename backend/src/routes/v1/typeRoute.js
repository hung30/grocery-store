import express from "express";
import { typeController } from "~/controllers/typeController";

const Router = express.Router();

Router.route("/:id")
  .get(typeController.getTypeById)
  .put(typeController.updateTypeById)
  .delete(typeController.deleteTypeById);

Router.route("/")
  .get(typeController.getAllTypes)
  .post(typeController.createNewType);

export const typeRoute = Router;
