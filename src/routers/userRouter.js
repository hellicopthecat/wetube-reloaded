import express from "express";
import {
  editUser,
  deleteUser,
  logout,
  see,
  githubLogin,
  finishGithubLogin,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/:id", see);
userRouter.get("/edit", editUser);
userRouter.get("/delete", deleteUser);
userRouter.get("/github/start", githubLogin);
userRouter.get("/github/finish", finishGithubLogin);

export default userRouter;
