import UserModel from "../models/usermodel";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: "JOIN"});
};
export const postJoin = async (req, res) => {
  const {username, email, password, name, location} = req.body;
  const pageTitle = "JOIN";
  // if (password !== checkpass) {
  //   return res.status(400).render("join", {
  //     pageTitle: pageTitle,
  //     errorMessage: "password confirmation does not match",
  //   });
  // }

  await UserModel.create({
    username,
    email,
    password,
    name,
    location,
    // user를 저장하게 됨과 동시에 db에 password가 노출됨. 이에 따라 password를 hashing을 해줘야함.
    // hashing은 일방향 함수, 문자열이 필요. 이번 실습에 사용될 것은 bcrypt. npm i bcrypt
  });
  return res.redirect("/login");
};

export const getLogin = (req, res) => {
  return res.render("login");
};
export const postLogin = (req, res) => {};
