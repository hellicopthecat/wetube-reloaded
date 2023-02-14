import express from "express";
import {
  editUser,
  githubLogin,
  logout,
  postEditUser,
  postGithubLogin,
} from "../controllers/userControllers";
import {protectMiddleWare, publicOnly} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnly, githubLogin);
userRouter.get("/github/finish", publicOnly, postGithubLogin);
userRouter.get("/logout", protectMiddleWare, logout);
userRouter
  .route("/edit")
  .all(protectMiddleWare)
  .get(editUser)
  .post(postEditUser);

export default userRouter;
