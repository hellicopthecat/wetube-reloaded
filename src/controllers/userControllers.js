import UserModel from "../models/usermodel";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: "JOIN"});
};
export const postJoin = async (req, res) => {
  await UserModel.create({
    username,
    email,
    password,
  });
};

export const getLogin = (req, res) => {
  return res.render("login");
};
