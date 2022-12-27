import Video from "../models/videos";

export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", {pageTitle: "Home", videos});
};

export const watch = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if (video === null) {
    return res.render("404", {pageTitle: "Video Not Found."});
  } else {
    return res.render("watch", {
      pageTitle: `Watching now ${video.title}`,
      video,
    });
  }
};

export const edit = async (req, res) => {
  const {id} = req.params;
  const video = await Video.findById(id);
  if (video === null) {
    return res.render("404", {pageTitle: "Video Not Found."});
  } else {
    return res.render("edit", {pageTitle: `Editting  ${video.title}`, video});
  }
};
export const saveChange = (req, res) => {
  const {id} = req.params;
  const {title} = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", {pageTitle: `Uploading`});
};

export const postUpload = async (req, res) => {
  const {title, description, hashtags} = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: hashtags.split(",").map((word) => `#${word}`),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: `Uploading`,
      errorMessage: error._message,
    });
  }
};
