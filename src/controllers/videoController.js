import Video from "../models/videos";

export const home = async (req, res) => {
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", {pageTitle: "Home", videos});
};

export const watch = (req, res) => {
  const {id} = req.params;

  return res.render("watch", {
    pageTitle: `Watching now `,
  });
};

export const edit = (req, res) => {
  const {id} = req.params;

  return res.render("edit", {pageTitle: `Editting `});
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
  await Video.create({
    title,
    description,
    createdAt: Date.now(),
    hashtags: hashtags.split(",").map((word) => `#${word}`),
    meta: {
      views: 0,
      rating: 0,
    },
  });

  return res.redirect("/");
};
