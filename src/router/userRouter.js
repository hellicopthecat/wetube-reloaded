import express from "express";
import {
  githubLogin,
  logout,
  postGithubLogin,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/github/start", githubLogin);
userRouter.get("/github/finish", postGithubLogin);
userRouter.get("/logout", logout);

export default userRouter;
