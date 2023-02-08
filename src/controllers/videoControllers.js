import VideoModel from "../models/videomodels";

export const home = async (req, res) => {
  const videos = await VideoModel.find({}).sort({createAt: "desc"});
  return res.render("home", {pageTitle: "Home", videos});
};
export const watch = async (req, res) => {
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  // mongoose에서 id를 통해 대상을 찾음
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.render("404", {pageTitle: "Wrong Access"});
  }
  return res.render("watch", {
    pageTitle: `watch ${video.title}`,
    video,
  });
};

export const editVideo = async (req, res) => {
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  // mongoose에서 id를 통해 대상을 찾음
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.render("404", {pageTitle: "Wrong Access"});
  }
  return res.render("edit", {pageTitle: "Edit Video", video});
};

export const postEditVideo = async (req, res) => {
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  const video = await VideoModel.findById(id);
  // post 후 찾는 대상
  const {title, description, createdAt, hashtags} = req.body;

  if (!video) {
    return res.render("404", {pageTitle: "Wrong Access"});
  }
  await VideoModel.findByIdAndUpdate(id, {
    title,
    description,
    createdAt,
    hashtags: VideoModel.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const uploadVideo = (req, res) => {
  return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
  const {title, description, createdAt, hashtags} = req.body;
  try {
    await VideoModel.create({
      title,
      description,
      createdAt,
      hashtags: VideoModel.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = (req, res) => {
  return res.render("delete", {pageTitle: "Delete Video"});
};

export const postDelete = async (req, res) => {
  const {id} = req.params;
  await VideoModel.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = (req, res) => {
  res.render("search", {pageTitle: "SEARCH"});
};
