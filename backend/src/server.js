import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb.js";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import cors from "cors";

const START_SERVER = () => {
  const app = express();

  app.use(cors());

  //enable req.body json data
  app.use(express.json());

  app.use("/v1", APIs_V1);

  // middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  app.listen(env.PORT, env.APP_HOST, () => {
    console.log(`Server running at http://${env.APP_HOST}:${env.PORT}/`);
  });

  // Close mongoDB connection when exit app
  exitHook(() => {
    console.log(`Server closed!!`);
    CLOSE_DB;
  });
};

// Immediately-invoked / Anomymous Async Function (IIFE)
(async () => {
  try {
    console.log("Connecting to DB");
    await CONNECT_DB();
    console.log("Connected to DB");

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();

// CONNECT_DB()
//   .then(() => console.log("Connected to DB"))
//   .then(() => START_SERVER())
//   .catch((error) => {
//     console.error(error);
//     process.exit(0);
//   });
