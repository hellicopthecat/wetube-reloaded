import UserModel from "../models/Usermodels";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", {pageTitle: "JOIN"});
};
export const postJoin = async (req, res) => {
  const {username, email, password, checkpass, name, location} = req.body;

  const pageTitle = "JOIN";

  if (password !== checkpass) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "password confirmation does not match",
      // [3] password 확인 재입력 동일값이 안나오면 에러 도출.
    });
  }

  const exists = await UserModel.exists({$or: [{username}, {email}]});
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email already taken",
      //username의 존재 유무를 확인하고 사용된 username에 대한 에러를 내보내준다.
      //[4] 에러가 났음에도 불구하고 브라우저에는 status코드 200을 받았기 때문에 계정이 잘 생성되었다고 판단하여
      // 브라우져는 아이디와 비번을 저장하려고 한다. 이를 방지하기 위해 우리가 렌더링할 페이지에 에러코드를 넣어줘야함.
    });
  }

  /* [2] 
  const usernameExist = await UserModel.exists({username});
  if (usernameExist) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This username already taken",
      //username의 존재 유무를 확인하고 사용된 username에 대한 에러를 내보내준다.
    });
  }
  const emailExist = await UserModel.exists({email});
  if (emailExist) {
    return res.render("join", {
      pageTitle,
      errorMessage: "This email already taken",
      //email의 존재 유무를 확인하고 사용된 email에 대한 에러를 내보내준다.
    });
  } 
  이렇게 해도 상관은 없지만 구성자체가 중복된 구성이기에 이것을 하나로 보여주기 위해서는 
  mongodb의 $or operator를 사용할 수 있다.
  $or operator는 각 조건이 true일 때 실행되게 만들 수 있다.
  const *** = await UserModel.exitst({username, email})이라 함은 username과 email을 동시에 가진
  user만 체크할 수 있기 때문에 $or은 사용중인 username과 사용되지 않는 email을 가진 UserModel을 찾을 수 있다.  */

  try {
    await UserModel.create({
      username,
      email,
      password,
      name,
      location,
      // [1] user를 저장하게 됨과 동시에 db에 password가 노출됨. 이에 따라 password를 hashing을 해줘야함.
      // hashing은 일방향 함수, 문자열이 필요. 이번 실습에 사용될 것은 bcrypt. -- npm i bcrypt
      // 해커가 해싱된 password를 가지고 할 수 있는 공격이 있는데 이것을 rainbow table이라고 한다.
      // 이 rainbow table을 bcrypt가 막아줄 것이다.
      // npmjs의 bcrypt 문서 tech2 참조 , saltRounds는 pw를 더 예측하기 어렵게 만듬
    });
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message,
      // 더 많은 에러메세지를 잡기 위해 try catch 구문을 쓴다.
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", {pageTitle: "Log In"});
};
export const postLogin = async (req, res) => {
  const {username, password} = req.body;
<<<<<<< HEAD
  const pageTitle = "LOG IN";
  //check if account exists
  const user = await UserModel.findOne({username, socialOnly: false});
=======
  const pageTitle = "Log In";
  // [1] account의 존재(exists)
  const user = await UserModel.findOne({username});
>>>>>>> practice1
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username doen't exists",
    });
  }
  // [2] password 의 동일성(correct)
  // 입력한 password는 bcrypt로 변형되어 hashing이 되고
  // 변형된 hash값과 db에 저장된 hash값을 매칭 시켜 로그인
  // 이를 위해 bcrypt에 내장되어 있는 compare function을 사용 * bcrypt문서 To check a password: 참조
  // compare을 사용하기 위해 import한다.
  const ok = await bcrypt.compare(password, user.password);
  // compare에는 인풋으로 넘어온 데이터 그리고 해싱된 password를 넣어 비교해준다.
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Password is Wrong",
    });
  }
  // [3] 로그인으로 인한 cookie와 session의 분배
  // user를 기억하기 위해서는 cookie를 주어야한다. cookie를 이해하기 위해서는 먼저 session을 알아야하는데
  // session은 browser와 back-end 사이의 memory, history같은 것이다.
  // 이것이 작동하려면 browser와 back-end가 서로에 대한 정보를 가지고 있어야 한다.
  // 왜냐하면 로그인 페이지에서 http 요청을 하면 요청이 처리되고 끝나는데, 이때 back-end는 아무것도 할수 없다.
  // 즉, 요청을 받고 처리를 끝내면 서버는 누가 요청을 보냈는지 잊어버리고 서버가 더이상 필요는 브라우저도 잊음.
  // 이것을 stateless(무상태)라고 한다.
  // 그래서 우리는 유저에게 유저가 백엔드에 뭔가 요청 할 때마다 누가 요청하는 알수 있게 어떤 정보를 남겨줘야한다.
  // 유저에게 텍스트를 주는 이것을 쿠키...
  // express-session이라는 것을 설치해야하는데 이 middlewear는 express에서 세션을 처리할수 있게 한다.
  // 이것을 server.js에 import 한다. session 설정은 server.js에 기술

  /* // [4] 유저가 로그하면 그 유저에 대한 정보를 세션에 담을거다 
  // 각 유저마다 서로 다른 req.session object를 가지고 있다는걸 기억하자 */
  req.session.loggedIn = true;
  req.session.user = user;
  // 이렇게 하면 세션에 정보를 추가한다.
  // session에 loggedIn을 true로 저장했고 user는 usermodel에서 찾은 user를 추가했다.
  return res.redirect("/");
};

export const githubLogin = (req, res) => {
  // 소셜미디어 로그인 구현
  //https://github.com/login/oauth/authorize?client_id=CLIENT_ID&scope=user:email%20read:user
  const baseUrl = "https://github.com/login/oauth/authorize";
  // 사용자를 깃헙으로 redirect 시켜야한다.
  const config = {
    client_id: process.env.CLIENT_ID,
    allow_signup: false,
    scope: "read:user user:email",
    //scope는 유저에게서 얼마나 많이 정보를 읽어내고 어떤 정보를 가져올 것에 대한 것.
    //필요한 정보만 요청하도록 해야함
    //githb Oauth문서 참조 , 같은 파라미터를 써야한다.
  };
  const params = new URLSearchParams(config).toString();
  // 파라미터에 들어갈 문장을 URLSearchParams(config)를 .toString()을 통해 문장으로 변형
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};
export const postGithubLogin = async (req, res) => {
  //Github에서 받은 토큰을 access토큰으로 바꿔줘야한다.

  //[1]
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code: req.query.code,
    // 토큰을 액세스하기위한 필수요소들을 넣어준다.
    // code는 요청한 주소의 code를 불러와준다.
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
<<<<<<< HEAD

=======
  //[2]
  // log in 과 join 과 달리 redirect를 해주는 것이 아닌 post request를 보내기만 할 것이다.
  // 여기서는 fetch문을 사용할 것이다.
>>>>>>> practice1
  const tokenRequest = await (
    await fetch(finalUrl, {
      //우선 fetch를 통해 데이터를 받아오고
      method: "POST",
      headers: {
        Accept: "application/json",
        //application/json이것은 붙어써야함
        //JSON을 return받기 위해 위 headers에 작성한 것을 잊으면 안된다.
        //mdn fetch문서 참조 여기서 headers는 HTTP headers의 관한 내용으로 클라이어느와 서버가 request(or response)로
        //부가적인 정보를 전송할 수 있도록 한다. Accept는 돌려줄 타입에 대해 서버에게 알려주는 역할 MIME타입
        //MIME타입은 웹에서 사용되는 확장라고 생각하면 되고 type/subtype으로 구성되어 있다.
        //이를 디버깅하게 되면 fetch가 안써지는데 nodejs에는 fetch 기능이 없어 npmjs에 가서 node-fetch를 설치
        // 사용하고자 하는 곳에 import  ** 현 NodeJS 18.0.0 부터는 fetch 기능이 탑재 되있음. 따라서 설치 안해도 됨
        // 하지만 본인은 19.6.0 제일 최신을 쓰고 있어 아직 업데이트가 되지 않았음 따라서 node-fetch@2.6.7을 설치
      },
    })
  ).json();
  // const json = await data.json();
  // [4] data.json와 const tokenRequest에서 두 문장으로 await할 필요 없이 한문장으로 await을 작성
  // 그 데이터에서 JSON을 추출할것이다.
  //[3]
  //access_token을 갖고 api에 접근한다. access_token을 가지고 user의 정보를 얻을 수 있다.
  if ("access_token" in tokenRequest) {
    // access api
    const {access_token} = tokenRequest;
    const userRequest = await (
      await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
<<<<<<< HEAD
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

    let user = await UserModel.findOne({email: emailObj.email});
    if (!user) {
      //create an account
      user = await UserModel.create({
        avatarUrl: userData.avatar_Url,
        name: userData.name,
        socialOnly: true,
        username: userData.login,
        password: "",
        email: emailObj.email,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
=======
    console.log(userRequest);
    //[5] 위의 디버깅으로 토대로 user의 info를 가져올수 있지만 email이 null이 되었다. 이는 email이 없거나 private라는 뜻이다.
>>>>>>> practice1
  } else {
    return res.redirect("/login");
  }
};
<<<<<<< HEAD

export const kakaoLogin = (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/authorize";
  const config = {
    client_id: process.env.KAKAO_REST_API_KEY,
    response_type: "code",
    redirect_uri: "http://localhost:4000/users/kakao/finish",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishKakaoLogin = async (req, res) => {
  const baseUrl = "https://kauth.kakao.com/oauth/token";
  const config = {
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_REST_API_KEY,
    redirect_url: "http://localhost:4000/users/kakao/finish",
    code: req.query.code,
    client_secret: process.env.KAKAO_SECRET,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const {access_token} = tokenRequest;
    const apiUrl = "https://kapi.kakao.com/v2/user/me";
    const userData = await (
      await fetch(`${apiUrl}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
    ).json();

    const kakaoAccount = userData.kakao_account;
    const kakaoProfile = kakaoAccount.profile;

    if (
      kakaoAccount.is_email_valid === false ||
      kakaoAccount.is_eamil_verified === false
    ) {
      return res.redirect("/login");
    }
    let user = await UserModel.findOne({email: kakaoAccount.email});
    if (!user) {
      user = await UserModel.create({
        name: kakaoProfile.nickname,
        socialOnly: true,
        username: kakaoProfile.nickname,
        email: kakaoAccount.email,
        password: "",
        avatarUrl: kakaoProfile.profile_image_url,
        location: "",
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const see = (req, res) => res.send("see my porfile");
export const editUser = (req, res) => res.send("user");
export const deleteUser = (req, res) => res.send("delete user");
=======
>>>>>>> practice1
