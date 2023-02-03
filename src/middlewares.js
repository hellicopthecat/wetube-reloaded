export const localsMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  /* 위와 같음
    //   if (req.session.loggedIn) {
        //     res.locals.loggedIn = true;
        //   }
        */
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user;
  next();
};
