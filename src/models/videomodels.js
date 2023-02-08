import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {type: String, maxlength: 20, required: true},
  description: {type: String, minlength: 10, required: true},
  createdAt: {type: Date, required: true, default: new Date()},
  hashtags: [{type: String, trim: true}],
  meta: {
    rate: {type: Number, default: 0, required: true},
    view: {type: Number, default: 0, required: true},
  },
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
