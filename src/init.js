import "./db";
import app from "./server";

const port = 4000;

const handleServer = () => console.log(`✅ Server is on localhost:${port}`);
app.listen(port, handleServer);
