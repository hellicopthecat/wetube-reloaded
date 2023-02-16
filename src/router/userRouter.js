import express from "express";
import {
  editUser,
  getchangePW,
  githubLogin,
  logout,
  postchangePW,
  postEditUser,
  postGithubLogin,
  profile,
} from "../controllers/userControllers";
import {
  protectMiddleWare,
  publicOnlyMiddleware,
  avatarUpload,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, githubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, postGithubLogin);
userRouter.get("/logout", protectMiddleWare, logout);
userRouter
  .route("/edit")
  .all(protectMiddleWare)
  .get(editUser)
  .post(avatarUpload.single("avatar"), postEditUser);
// 해당 avatar이름 기입과 controllers에 작성
userRouter
  .route("/change-password")
  .all(protectMiddleWare)
  .get(getchangePW)
  .post(postchangePW);
userRouter.get("/:id", profile);

export default userRouter;
