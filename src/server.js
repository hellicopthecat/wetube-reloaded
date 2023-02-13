import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";
import {localsMiddleware} from "./middlewares";

const app = express();

//app.set , app.use의 순서는 꼭 지켜야한다. 순서만달라도 에러가 난다.

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use(morgan("dev"));

// html 의 form의 value를 이해하고 우리가 쓸 수 있는 자바스크립트 형식으로 변형
app.use(express.urlencoded({extended: true}));

app.use(
  session({
    /* session 설명
    이제 이 middlewear가 사이트로 들어오는 모두를 기억하게 될것이다.
    현재 파일을 저장하게 되면 새로 쿠키를 받게 됨. 나중에 백엔드가 잊지 않도록 세션을 mongoDB와 연결함.
    session과 session id는 브라우저를 기억하는 방식 중 하나.
    */
    secret: "what",
    resave: false,
    saveUninitialized: false,
    // 세션이 새로 만들어지고 수정된 적이 없을 때 Unitialized(초기화되지 않은)
    store: MongoStore.create({mongoUrl: `mongodb://127.0.0.1:27017/wetube`}),
  })
);
// session data는 쿠키 안에 저장이 되지 않는다. session data는 서버 쪽에 저장이 된다.
// 주의사항으론 서버에 저장되는 default session storage는 memory store고 실제 사용하기 위해 있는것은 아니다.
// 그래서 우리는 session store를 사용해야 한다. 문서를 확인해서 설치 할것을 찾아야한다.
// 현재 mongoDB를 사용하기 때문에 connect-mongo를 설치해준다. 설치후 import하고 mongoDB와 연결해 session스토어를 만들어준다.

// 브라우저에 들어오는 사람마다 cookie를 줄 필요가 없다. 내가 기억하고 싶은 사용자, 즉 로그인 한 사용자에 대해서만 쿠키를 주려면
// resave와 saveUninitialized를 false로 한다.

// app.use((req, res, next) => {
//   console.log(res);
// });

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app;
