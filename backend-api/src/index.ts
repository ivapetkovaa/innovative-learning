const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const mongoose = require("mongoose");

import router from "./router";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
server.listen(8080, () => {
  console.log("Server running on port http://localhost:8080");
});
// "mongodb+srv://ivapetkovaa:i3HqLUvm3hzreEuL@cluster0.fe82mn8.mongodb.net/"
const MONGO_URL =
  "mongodb+srv://ivapetkovaa:i3HqLUvm3hzreEuL@cluster0.fe82mn8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

app.use("/", router());
