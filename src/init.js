import "dotenv/config";
import "./db";
import "./models/Videomodels";
import "./models/Usermodels";
import "./models/Comment";
import app from "./server";

const port = 4000;

const handleServer = () => console.log(`✅ Server is on localhost:${port}`);
app.listen(port, handleServer);
