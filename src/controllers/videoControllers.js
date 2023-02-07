const videos = [
  {
    title: "first",
    description: "this is description",
    createdAt: "seoul",
    hashtags: "#hoho",
    rate: 5,
    view: 0,
    id: 1,
  },
  {
    title: "second",
    description: "this is description",
    createdAt: "seoul",
    hashtags: "hoho",
    rate: 3,
    view: 0,
    id: 2,
  },
];

export const home = (req, res) => {
  return res.render("home", {pageTitle: "Home", videos});
};
export const watch = (req, res) => {
  const {id} = req.params;
  const video = videos[id - 1];
  return res.render("watch", {
    pageTitle: `watch ${video.title}`,
    video,
  });
};

export const editVideo = (req, res) => {
  const {id} = req.params;
  const video = videos[id - 1];
  return res.render("edit", {pageTitle: `Edit video ${video.title}`, video});
};

export const uploadVideo = (req, res) => {
  return res.send("upload videos");
};

export const deleteVideo = (req, res) => {
  return res.send("delete video");
};
