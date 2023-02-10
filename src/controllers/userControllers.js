import UserModel from "../models/Usermodels";
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
  /* [2] const usernameExist = await UserModel.exists({username});
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
  user만 체크할 수 있기 때문에 $or은 사용중인 username과 사용되지 않는 email을 가진 UserModel을 찾을 수 있다. */

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
  const pageTitle = "Log In";
  // [1] account의 존재(exists)
  const user = await UserModel.findOne({username});
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
  // compare에는 인풋으로 넘어온 데이터 그리고 해싱된 password를 넣어준다.
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Password is Wrong",
    });
  }
  //[3] 로그인으로 인한 쿠키와 세션의 분배
  return res.redirect("/");
};
