import UserModel from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: `Join`});
};
export const postJoin = async (req, res) => {
  const {email, username, password, password2, name, location} = req.body;
  const pageTitle = "Join";

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  // const usernameExists = await UserModel.exists({username});
  // if (usernameExists) {
  //   return res.render("join", {
  //     pageTitle,
  //     erroMessage: "This username is already taken.",
  //   });
  // }
  // const emailExists = await UserModel.exists({email});
  // if (emailExists) {
  //   return res.render("join", {
  //     pageTitle,
  //     erroMessage: "This email is already taken.",
  //   });
  // }
  const exists = await UserModel.exists({
    $or: [{username}, {email}],
  });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username or Email already used",
    });
  }
  try {
    await UserModel.create({
      email,
      username,
      password,
      name,
      location,
    });
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
    });
  }
  return res.redirect("/login");
};
export const getLogin = (req, res) =>
  res.render("login", {pageTitle: "LOG IN"});

export const postLogin = async (req, res) => {
  const {username, password} = req.body;
  const pageTitle = "LOG IN";
  //check if account exists
  const user = await UserModel.findOne({username});
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An Account with this username does not exists.",
    });
  }
  //check if password correct
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const githubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };

  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    // access api
    const {access_token} = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {Authorization: `token ${access_token}`},
      })
    ).json();
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {Authorization: `token ${access_token}`},
      })
    ).json();

    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }

    const existingUser = await UserModel.findOne({email: emailObj.email});
    if (existingUser) {
      req.session.loggedIn = true;
      req.session.user = existingUser;
      return res.redirect("/");
    } else {
      //create an account
      const user = await UserModel.create({
        name: userData.name,
        socialOnly: true,
        username: userData.login,
        password: "",
        email: emailObj.email,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = user;
      return res.redirect("/");
    }
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => res.send("log out");

export const see = (req, res) => res.send("see my porfile");

export const editUser = (req, res) => res.send("user");
export const deleteUser = (req, res) => res.send("delete user");
