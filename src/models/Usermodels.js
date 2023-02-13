import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  username: {type: String, minlength: 4, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, minlength: 4, required: true},
  checkpass: {type: String, minlength: 4},
  name: {type: String, required: true},
  location: String,
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
