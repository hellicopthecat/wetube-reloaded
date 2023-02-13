import express from "express";
import {
  watch,
  editVideo,
  postEditVideo,
  uploadVideo,
  postUpload,
  deleteVideo,
  postDelete,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideo).post(postEditVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .get(deleteVideo)
  .post(postDelete);
videoRouter.route("/upload").get(uploadVideo).post(postUpload);

export default videoRouter;
