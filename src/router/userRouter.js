import express from "express";
import {
  editUser,
  githubLogin,
  logout,
  postEditUser,
  postGithubLogin,
} from "../controllers/userControllers";
import {protectMiddleWare, publicOnlyMiddleware} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, githubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, postGithubLogin);
userRouter.get("/logout", protectMiddleWare, logout);
userRouter
  .route("/edit")
  .all(protectMiddleWare)
  .get(editUser)
  .post(postEditUser);

export default userRouter;
