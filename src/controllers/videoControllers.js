import VideoModel from "../models/Videomodels";
import UserModel from "../models/Usermodels";
import Comment from "../models/Comment";

export const home = async (req, res) => {
  const videos = await VideoModel.find({})
    .sort({createdAt: "desc"})
    .populate("owner");
  return res.render("home", {pageTitle: "Home", videos});
};
export const watch = async (req, res) => {
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  // mongoose에서 id를 통해 대상을 찾음
  const video = await VideoModel.findById(id)
    .populate("owner")
    .populate("comments");
  // 아래 findbyid가 두번나와서 이것을 간소화 시킬 필요가 있다. populate 실제 user데이터로 채워준다
  // const owner = await UserModel.findById(video.owner);
  if (!video) {
    return res.render("404", {pageTitle: "Wrong Access"});
  }
  return res.render("watch", {
    pageTitle: `watch ${video.title}`,
    video,
    // owner,
  });
};

export const editVideo = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  // mongoose에서 id를 통해 대상을 찾음
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: "Wrong Access"});
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "NOT Authorized");
    return res.status(403).redirect("/");
  }
  return res.render("edit", {pageTitle: "Edit Video", video});
};

export const postEditVideo = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  // 내가요청한 파라미터 아이디
  const {id} = req.params;
  const {title, description, hashtags} = req.body;
  // console.log(req.body);
  // post 후 찾는 대상
  const video = await VideoModel.exists({_id: id});
  // post에서는 findById를 통한 전체적인 video를 찾을 필요가 없다. 따라서
  // exists라는 함수를 통해 존재의 유무를 Boolean으로 확인할 수 있다.
  // exists는 Mongoose 문서에 보면 id를 받지 않고 filter를 받는다.
  // 그래서 exists()에  {조건} 을 넣을 것이다.
  // mongo데이터에 object _id가 있고 req.params.id와 같은 경우를 찾는 것이다.

  if (!video) {
    return res.status(404).render("404", {pageTitle: "Wrong Access"});
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
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

export const postUpload = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  const {video, thumb} = req.files;
  const {title, description, hashtags} = req.body;
  try {
    const newVideo = await VideoModel.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: VideoModel.formatHashtags(hashtags),
    });
    const user = await UserModel.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = (req, res) => {
  return res.render("delete", {pageTitle: "Delete Video"});
};

export const postDelete = async (req, res) => {
  const {
    user: {_id},
  } = req.session;
  const {id} = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.status(404).render("404", {pageTitle: "Wrong Access"});
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
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

export const registerView = async (req, res) => {
  const {id} = req.params;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.view = video.meta.view + 1;
  await video.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  // const {id} = req.params;
  // const {text} = req.body;
  // const {user} = req.session
  const {
    session: {user},
    body: {text},
    params: {id},
  } = req;
  const video = await VideoModel.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id);
  video.save();
  return res.sendStatus(201);
};
// 댓글을 지우는 기능
/* span x 클릭할때 fetch request를 보내서 댓그을 지우게 함
유저가 댓글의 주인이 맞느지 댓글을 지우기 전에 확인
모두에게 보이게 하면 안됨 작성자만이 자기것을 지우고 지우는 기능을 볼수 있게 해야함 템플릿을 적용해서 삭제버튼을 볼수 잇게 해햔다.
 */
