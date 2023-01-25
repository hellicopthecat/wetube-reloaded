import mongoose from "mongoose";
// 터미널에서 mongodb url을 받아와서 mongoose 와 연결해준다.

mongoose.set("strictQuery", true);

mongoose.connect("mongodb://127.0.0.1:27017/wetube");

const db = mongoose.connection;

const handleOpen = () => console.log("🚀 Connected to DB 🚀");
db.on("error", (error) => console.log("❌ DB ERROR ❌", error));
db.once("open", handleOpen);
