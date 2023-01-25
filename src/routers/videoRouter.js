import express from "express";
import {
  watch,
  editVideo,
  deleteVideo,
  uploadVideo,
  postEdit,
  postUploadVideo,
} from "../controllers/videoConstrollers";

const videoRouter = express.Router();

/* (:)는 parameter를 뜻함 
(\d+)는 숫만 지정함을 말함 d = digit
/ 자바스크립트이기때문에 백슬레쉬 를 하나 더 추가해야함. (\\+d)
/ (+*?) 등의 기호로 정규식을 만들수 있음 (express 문서 참조)
/ [0-9a-f]{24} mongodb는 16진법으로 id를 부여함 그에 따른 조합식은 [0-9a-f]{24} 과 같다.*/
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(editVideo).post(postEdit);
videoRouter.route("/upload").get(uploadVideo).post(postUploadVideo);
videoRouter.get("/:id([0-9a-f]{24})/delete", deleteVideo);

export default videoRouter;
