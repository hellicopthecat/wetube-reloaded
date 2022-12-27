import "./db";
import "./models/videos";
import app from "./index";

const PORT = 4000;

const handleServer = () =>
  console.log("✅ server Listenting on port http://localhost:${PORT} 🚀");

app.listen(PORT, handleServer);
