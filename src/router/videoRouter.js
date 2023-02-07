import express from "express";
import {
  deleteVideo,
  editVideo,
  uploadVideo,
  watch,
} from "../controllers/videoControllers";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)/watch", watch);
videoRouter.get("/:id(\\d+)/edit", editVideo);
videoRouter.get("/:id(\\d+)/delete", deleteVideo);
videoRouter.get("/upload", uploadVideo);

export default videoRouter;
