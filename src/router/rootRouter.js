import express from "express";
import {home, search} from "../controllers/videoControllers";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userControllers";
import {publicOnlyMiddleware} from "../middlewares";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route("/login")
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);

export default rootRouter;
