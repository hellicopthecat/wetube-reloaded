/* nodeJS - express - babel - nodemon - morgan - mongo - mongoose */

import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import userRouter from "./routers/userRouter";

const app = express();
const logger = morgan("dev");

// /* html 대신 pug를 사용 html은 각종 변수를 전달하지 못해 pug를 씀
// npm으로 pug설치 후 app.set("view engine", "pug")으로 뷰엔진을 pug로 쓸것을 지정해줌
// views라고 폴더를 만들어 그안에 viewer를 넣어준다
// views폴더는 process.cwd 산하로 구조 되어있는데 이를 고치기위해서는 해당 폴더로 폴더 이동 혹은
// app.set("views", process.cwd()+ "/src/views");를 작성해준다.
// process.cwd()는 현재 작업 디렉토리 노드를 시작하는 디렉토리라는 것
// 주의 해야할 사항은 각 라우터 마다 express.Router()를 지정해줘야한다. */

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

app.use(logger);

app.use(express.urlencoded({extended: true}));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
