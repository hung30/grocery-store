import express from "express";
import { GET_DB } from "~/config/mongodb";

const Router = express.Router();

Router.get("/", async (req, res) => {
  const status = await GET_DB().collection("status").find().toArray();

  res.json(status);
});

export const statusRoute = Router;
