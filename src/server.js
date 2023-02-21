import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";
import apiRouter from "./router/apiRouter";
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
    secret: process.env.COOKIE_SECRET,
    // secret은 우리가 쿠키에대해 sign 할 때 사용하는 String이다. 쿠키에 sign하는 이유는 우리의 backend가 쿠키를 줬다는걸 보여주기 위함이다.
    // 이것을 잘 보호해야 하는데 , 누군가 쿠키를 훔쳐 마치 나인 척 할 수 있다. 이런건 길게 작성되고 강력하고 무작위로 만들어야 한다.
    // domain은 이 쿠키를 만든 backend가 누군지 알려준다.
    // expires는 쿠키의 만료 날짜를 명시를 나타냄 max-age는 언제 세션이 만료되는지 알려준다. 이것을 조정할 수 있는데 아래 참조
    // cookie: {
    //   maxAge: 20000,
    //   // 1/1000초
    // },

    resave: false,
    saveUninitialized: false,
    // 세션이 새로 만들어지고 수정된 적이 없을 때 Unitialized(초기화되지 않은)
    store: MongoStore.create({mongoUrl: process.env.DB_URL}),
    // url도 보호 되어야한다.
    //.env 파일을 사용하기 위해서는 dotenv를 설치하고 import를 해주어야하는데 이때 import의 위치는
    //가능한 제일 빨리 import될 수 있게 작성해야한다. 그 기준은 package.json을 통해 볼 수 있다.
    //require을 쓰게 된다면 모든 파일에 작성을 해야한다. import는 선언문이라 hosting이 되고 require은 표현식이라 import보다 늦게 호출된다.
    // init에 dotenv/config를 바로 불러온다. process.env.***으로 사용되어야한다.
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
//static은 내가 노출시키고 싶은 폴더를 지칭할수있다.
app.use("/uploads", express.static("uploads"));
app.use("/assets", express.static("assets"));
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);
export default app;
