import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import mongoose from "mongoose";
import morgan from "morgan";
import "dotenv/config";
import routes from "./src/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,Authorization"
  );
  next();
});

app.use("/api/v1", routes);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/client/build")));
app.get("*", (req, res) =>
  res.sendFile(path.join(_dirname, "/client/build/index.html"))
);

const port = process.env.PORT || 5000;
const server = http.createServer(app);

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to db");
    server.listen(port, () => {
      console.log(`serve at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log({ err });
    process.exit(1);
  });
