import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: {type: String, maxlength: 20, require: true},
  description: {type: String, minlength: 10, require: true},
  createdAt: {type: Date, require: true, default: new Date()},
  hashtags: [{type: String, require: true}],
  meta: {
    rate: {type: Number},
    view: {type: Number},
  },
});

const VideoModel = mongoose.model("video", videoSchema);

export default VideoModel;
