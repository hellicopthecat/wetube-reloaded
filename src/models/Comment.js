import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: {type: String, required: true},
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  video: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "video"},
  createdAt: {type: Date, required: true, default: Date.now()},
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
