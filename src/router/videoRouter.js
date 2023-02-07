import express from "express";
import {
  deleteVideo,
  editVideo,
  postVideo,
  uploadVideo,
  postUpload,
  watch,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideo).post(postVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);
videoRouter.route("/upload").get(uploadVideo).post(postUpload);

export default videoRouter;
