import express from "express";
import { configDotenv } from "dotenv";
import router from "./router/index.js";
import instanceMong from "./db/connect.js";
import cors from "cors";
configDotenv();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router);
app.use((req, res, next) => {
  res.send("Path not found");
  next();
});
app.use((err, req, res, next) => {
  res.status(500).json({
    message: "external server",
  });
});

export default app;
