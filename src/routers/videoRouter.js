import express from "express";
import {
  watch,
  getUpload,
  edit,
  saveChange,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(edit).post(saveChange);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
