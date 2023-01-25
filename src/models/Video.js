/* videos의 구체적이고 부가적인 모델(사항)들을 만듬 */

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    maxLength: 40,
  },
  description: {type: String, required: true, trim: true, minLength: 10},
  // 글자의 길이에 관련하여 제한을 두었다면 JS와 HTML에도 같이 알려주어야함. 이것은 보안적 문제로 결부됨
  createdAt: {type: Date, required: true, default: Date.now},
  hashtags: [{type: String, trim: true}],
  meta: {
    views: {type: Number, default: 0, required: true},
    rating: {type: Number, default: 0, required: true},
  },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

const VideoModel = mongoose.model("Video", videoSchema);

export default VideoModel;
