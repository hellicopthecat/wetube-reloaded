import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type: String, minlength: 8, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  checkpass: {type: String, required: true},
  name: {type: String, required: true},
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
