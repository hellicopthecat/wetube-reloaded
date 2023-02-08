import express from "express";
import {home, search} from "../controllers/videoControllers";
import {getJoin, getLogin, postJoin} from "../controllers/userControllers";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", search);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", getLogin);

export default rootRouter;
