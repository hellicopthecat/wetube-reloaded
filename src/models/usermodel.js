import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {type: String, minlength: 4, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, minlength: 4, required: true},
  checkpass: {type: String, minlength: 4},
  name: {type: String, required: true},
  location: String,
});

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
