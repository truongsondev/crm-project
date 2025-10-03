import express from "express";
import { configDotenv } from "dotenv";
import router from "./router/index.js";
import instanceMong from "./db/connect.js";
import cors from "cors";
import User from "./schema/user.schema.js";
configDotenv();
const app = express();
app.use(express.json());
app.use(cors());
app.use("/", router);
app.use((req, res, next) => {
  res.status(404).send("Path not found");
  next();
});
const dataSample = {
  first_name: "T1 ",
  last_name: "Doran",
  username: "doran",
  password: "Ltson123456@",
  email: "sonslute@t1.com",
  address: "VN",
  salutation: "Mr.",
  role: "USER_ADMIN",
  job_title: "Top Lane",
  is_active: true,
  is_manager: true,
  hired_date: "Aug 11, 2025, 12:00:00 AM",
};

const initUser = async () => {
  const user = await User.find();
  console.log(user);
  if (user.length <= 0) {
    await User.insertOne(dataSample);
  }
};

initUser();

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "An unexpected error occurred on the server.";

  res.status(statusCode).json({
    success: false,
    message,
  });
});

export default app;
