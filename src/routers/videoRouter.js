import express from "express";
import {
  watch,
  getUpload,
  edit,
  saveChange,
  postUpload,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);
videoRouter.route("/:id(\\d+)/edit").get(edit).post(saveChange);
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
