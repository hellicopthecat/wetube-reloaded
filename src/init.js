import "./db";
import "./models/Video";
import app from "./server";

const PORT = 4000;

const handleServer = () =>
  console.log(`✅ The Server is live on port http://localhost:${PORT} ✅`);

app.listen(PORT, handleServer);
