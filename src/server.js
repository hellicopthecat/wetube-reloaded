import express from "express";
import morgan from "morgan";

import rootRouter from "./router/rootrouter";
import videoRouter from "./router/videorouter";
import userRouter from "./router/userrouter";
const app = express();

app.set("view engine", "pug");
app.set("views", "./src/views");

app.use(morgan("dev"));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);

export default app;
