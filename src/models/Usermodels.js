import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {type: String, minlength: 4, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String},
  //소셜로그인하는 과정에서 password가 데이터로 넘오지 않기때문에 required true를 하면 안된다.
  checkpass: {type: String, minlength: 4},
  name: {type: String, required: true},
  location: String,
  githubId: {type: Boolean, default: false},
  avatarUrl: {type: String},
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});
// 먼저 bcrypt를 import 해준다.
// userScheme 를 save 하기 전(pre) async function()을 할 건데 { 그것은
// 이 (this). password는 해쉬를 할건데 그것은 이(this).password이며  saltRound를 5번 할것이고
// 콜백 함수는 async await를 사용했기 때문에 쓸 필요가 없다. (bcrypt문서 async await promise 참조)}

const UserModel = mongoose.model("user", userSchema);

export default UserModel;
