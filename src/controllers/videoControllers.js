import VideoModel from "../models/videomodels";

export const home = async (req, res) => {
  const videos = await VideoModel.find({}).sort({createdAt: "desc"});
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

export const search = async (req, res) => {
  //console.log(req.query);
  //req.query는 해당 html method get을 통한 주소창의 get값을 가져온다.
  const {keyword} = req.query;
  let videofind = [];
  if (keyword) {
    //if문에서 const를 사용시 if문 밖으로 도출 될 수 없기에 let문으로 업데이트를 할 수 있도록 만들어준다.
    videofind = await VideoModel.find({
      // regular expression 정규표현식을 이용하여 한글자만 쳐도 검색할 수 있게 만든다.
      // i는 대소문자를 무시 $는 ***$사용시 마지막 ***단어로 검색하고 싶을 때 사용 ^***은 처음 단어
      // 위를 사용하기 위해서는 regex라는 연산자(operator)를 사용.
      title: {
        $regex: new RegExp(keyword, "i"),
        // 이는 mongoose가 아닌 mongo db에서 한다.
      },
    });
  }
  res.render("search", {pageTitle: "SEARCH", videofind});
};
