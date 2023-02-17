import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {type: String, maxlength: 20, required: true},
  fileUrl: {type: String, required: true},
  description: {type: String, minlength: 10, required: true},
  createdAt: {type: Date, required: true, default: new Date()},
  hashtags: [{type: String, trim: true}],
  meta: {
    rate: {type: Number, default: 0, required: true},
    view: {type: Number, default: 0, required: true},
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  //reference를 추가할건데 그 이유는 'mongoose'에게 owner에 id를 저장하겠다고 알려줘야하기때문
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
  // hashtags.split(",").map((word) => `#${word}`);
  // hashtags는 comma로 split하고 단어마다 map을 통해 객체화 하고 객체마다 구성된 단어로 조합한다.
  // edit post 과정에서 save할 경우 #이 계속 붙게 되어 더 추가 할 수 없게 지정함.
});

const VideoModel = mongoose.model("video", videoSchema);

export default VideoModel;
