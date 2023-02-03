import express from "express";

const Express = require("express");
const app = express();
const port = 4000;

const handleServer = () => console.log(`✅ Server is on localhost:${port}`);

app.listen(port, handleServer);
