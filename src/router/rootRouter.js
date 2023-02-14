import express from "express";
import {home, search} from "../controllers/videoControllers";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userControllers";
import {publicOnly} from "../middlewares";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").all(publicOnly).get(getJoin).post(postJoin);
rootRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);

export default rootRouter;
