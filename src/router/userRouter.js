import express from "express";
import {githubLogin, postGithubLogin} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/github/start", githubLogin);
userRouter.get("/github/finish", postGithubLogin);

export default userRouter;
