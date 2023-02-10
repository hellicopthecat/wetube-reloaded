export const localsMiddleware = (req, res, next) => {
  // localsMiddleware 은 server의 session보다 나중에 있기 때문에 session에 접근할수 있다.

  if (req.session.loggedIn) {
    res.locals.loggedIn = true;
  }
  // res.locals.loggedIn = Boolean(req.session.loggedIn) 위와 같은 내용이다.

  res.locals.loggedInUser = req.session.user;
  /* console.log(req.session);
  console.log(res.locals);
  console.log(res.locals.loggedInUser); */

  res.locals.siteName = "Wetube";
  next();
};
