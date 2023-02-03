import express from "express";
import {
  editUser,
  deleteUser,
  logout,
  see,
  githubLogin,
  finishGithubLogin,
  kakaoLogin,
  finishKakaoLogin,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id", see);
userRouter.get("/github/start", githubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/kakao/start", kakaoLogin);
userRouter.get("/kakao/finish", finishKakaoLogin);
userRouter.get("/delete", deleteUser);

export default userRouter;
