import {query} from "express";
import VideoModel from "../models/Video";

/*
[1]
VideoModel.find({}, (error, videos) => {
if(error){
  return res. render("server-error")
}
 return res.render("home", {pageTitle: "HOME", videos: []});
});
*/
export const home = async (req, res) => {
  // 참조 [1]
  const videos = await VideoModel.find({}).sort({createdAt: "desc"});
  return res.render("home", {pageTitle: "HOME", videos});
};

export const watch = async (req, res) => {
  const {id} = req.params;
  // 위와 같은 내용 const id = req.params.id;
  const video = await VideoModel.findById(id);
  if (video == null) {
    return res.render("404", {pageTitle: `Video Not Found`});
  }
  return res.render("watch", {pageTitle: `WATCHING ${video.title}`, video});
};

export const editVideo = async (req, res) => {
  const {id} = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: `Video Not Found`});
  }
  return res.render("edit", {pageTitle: `EDIT ${video.title}`, video});
};

export const postEdit = async (req, res) => {
  const {id} = req.params;
  /* req.body를 통해 사용자가 편집할 사항을 체크 / 
  / express는 아직 form에 대해 어떻게 다뤄야할지 몰라 지정해줘야한다. 
  / 그러기 위해서는 express.urlencoded({})를 사용해야 한다. form의 body를 이해한다.
  / express의 extend를 통해 body에 있는 정보들을 보기 좋게 형식을 갖추게 한다.
  / server.js로 가서 routes를 사용하기 전 middleware을 사용 app.use(express.urlencoded({extended:true}))*/
  const {title, description, hashtags} = req.body;
  const video = await VideoModel.exists({_id: id});
  if (!video) {
    return res.render("404", {pageTitle: `Video Not Found`});
  }
  await VideoModel.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: VideoModel.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const uploadVideo = (req, res) => {
  return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUploadVideo = async (req, res) => {
  const {title, description, hashtags} = req.body;
  // const video = new VideoModel({
  //   title,
  //   description,
  //   hashtags: hashtags.split(",").map((word) => `#${word}`),
  //   meta: {
  //     views: 0,
  //     rating: 0,
  //   },
  // });
  // await video.save();
  //*.save()를 해야 몽고db에 저장됨.
  try {
    await VideoModel.create({
      title,
      description,
      hashtags: VideoModel.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const {id} = req.params;
  console.log(id);
  //delete video
  await VideoModel.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const {keyword} = req.query;
  let videoWhatFind = [];
  if (keyword) {
    //search
    videoWhatFind = await VideoModel.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
      },
    });
  }

  return res.render("search", {pageTitle: `Search`, videoWhatFind});
};
