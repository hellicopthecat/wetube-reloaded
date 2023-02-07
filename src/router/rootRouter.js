import express from "express";
import {home} from "../controllers/videoControllers";
import {getJoin, getLogin} from "../controllers/userControllers";
const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/join", getJoin);
rootRouter.get("/login", getLogin);

export default rootRouter;
