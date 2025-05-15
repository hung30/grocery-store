import express from "express";
import exitHook from "async-exit-hook";
import { CONNECT_DB, CLOSE_DB } from "~/config/mongodb.js";
import { env } from "~/config/environment";
import { APIs_V1 } from "~/routes/v1";
import { errorHandlingMiddleware } from "~/middlewares/errorHandlingMiddleware";
import cors from "cors";
import { corsOptions } from "~/config/corsOptions";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "~/config/passport";
import { otpModel } from "./models/otpModel";
import { startOrderCleanupJob } from "./jobs/orderCleanupJob";

const START_SERVER = () => {
  const app = express();

  // Cấu hình trust proxy
  app.set("trust proxy", true);

  app.use(cookieParser());
  app.use(cors(corsOptions));

  // Cấu hình session
  app.use(
    session({
      secret: env.CLIENT_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

  // Khởi tạo Passport.js
  app.use(passport.initialize());
  app.use(passport.session());

  //enable req.body json data
  app.use(express.json());

  app.use("/v1", APIs_V1);

  // middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware);

  if (env.BUILD_MODE === "production") {
    app.listen(process.env.PORT, () => {
      console.log(`Server running at Port: ${process.env.PORT}`);
    });
  } else {
    app.listen(env.PORT, env.APP_HOST, () => {
      console.log(`Server running at http://${env.APP_HOST}:${env.PORT}/`);
    });
  }

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
    await otpModel.createTTLIndexForDeleteOtpExpired();
    console.log("Connected to DB");
    startOrderCleanupJob();

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
