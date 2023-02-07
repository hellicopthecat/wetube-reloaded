// mongoDB와 Mongoose 연결

import mongoose from "mongoose";
mongoose.set("strictQuery", false);
mongoose.connect(`mongodb://127.0.0.1:27017/wetube`);

// 연결 후 성공 여부 에러 디버그 출력

const db = mongoose.connection;

const handleOpen = () => console.log("🚀 Data is connected 🚀");
const handleError = () => console.log("❌ DB Error❌");

// db.on("error", (error) => console.log("❌ DB Error❌", error));
db.on("error", handleError);
// **.on 은 여러번 발생
db.once("open", handleOpen);
// **.once는 한번만 발생
