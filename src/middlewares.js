import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  // localsMiddleware 은 server의 session보다 나중에 있기 때문에 session에 접근할수 있다.
  // console.log(req.session.id);
  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
  }
  // res.locals.loggedIn = Boolean(req.session.loggedIn) 위와 같은 내용이다.
  // console.log(res.locals);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  // console.log(res.locals.loggedInUser);
  next();
};

export const protectMiddleWare = (req, res, next) => {
  //여기에는 사용자가 로그인을 확인하고 로그인이 돼 있지 않을 경우 로그인 페이지로 Redirect 시킬것이다.
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "NOT Authorized");
    return res.redirect("/login");
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  //여기는 사용자가 loggedin 돼있지 않으면요청을 계속 하고 로그인이 돼엇을때 "/"로 redirect
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "NOT Authorized");
    return res.redirect("/");
  }
};

// 이 protect미들웨어는 userRouter videoRouter에 각각 추가 해야줘야한다. 나중에는 video model과 user model이 연결되기 때문이다.

// 작성후 해당 router post에 기능추가
export const avatarUpload = multer({
  dest: "uploads/avatars",
  limits: {fieldSize: 3000000},
});
export const videoUpload = multer({
  dest: "uploads/videos",
  limits: {fieldSize: 15000000},
});
