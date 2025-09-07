import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();
const URL_CONNECT = process.env.URL_CONNECT;
class ConnectDB {
  constructor() {
    this.connect();
  }
  connect = () => {
    mongoose
      .connect(URL_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to MongoDB Success ");
      })
      .catch((err) => console.error("MongoDB connection error:", err));
  };

  static getInstance() {
    if (!ConnectDB.instance) {
      ConnectDB.instance = new ConnectDB();
    }
  }
}
const instanceMong = ConnectDB.getInstance();
export default instanceMong;
