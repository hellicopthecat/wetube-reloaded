import express from "express";
import morgan from "morgan";
import session from "express-session";
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
    resave: true,
    saveUninitialized: true,
  })
);

// app.use((req, res, next) => {
//   console.log(res);
// });

app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app;
