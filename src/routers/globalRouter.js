import express from "express";
import {join, login} from "../controllers/userController";
import {home, getUpload} from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/upload", getUpload);

export default globalRouter;
