import express from "express";
import morgan from "morgan";
import rootRouter from "./router/rootRouter";
import videoRouter from "./router/videoRouter";
import userRouter from "./router/userRouter";
const app = express();

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use(morgan("dev"));

// html 의 form의 value를 이해하고 우리가 쓸 수 있는 자바스크립트 형식으로 변형
app.use(express.urlencoded({extended: true}));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app;
