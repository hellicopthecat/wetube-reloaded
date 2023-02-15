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
import {protectMiddleWare} from "../middlewares";

const videoRouter = express.Router();

videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectMiddleWare)
  .get(editVideo)
  .post(postEditVideo);
videoRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectMiddleWare)
  .get(deleteVideo)
  .post(postDelete);
videoRouter
  .route("/upload")
  .all(protectMiddleWare)
  .get(uploadVideo)
  .post(postUpload);

export default videoRouter;
