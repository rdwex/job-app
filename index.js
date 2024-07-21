import express from "express";
import { db_connect } from "./DB/modules/connections.js";
import userRouter from "./src/modules/user/user.routes.js";
import companyRouter from "./src/modules/company/company.routes.js";
import jobRouter from "./src/modules/job/job.routes.js";
import { globalResponse } from "./src/middleware/error-handling.middleware.js";

import { config } from "dotenv";
if (process.env.NODE_ENV == "dev") {
  config({ path: path.resolve(".dev.env") });
}
if (process.env.NODE_ENV == "prod") {
  config({ path: path.resolve(".prod.env") });
}
config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/company", companyRouter);
app.use("/user", userRouter);
app.use("/job", jobRouter);

app.use(globalResponse)
db_connect();

app.get("/", (req, res) => {
  res.send("Hello world!");
});
app.use("*", (req, res) => {
  res.status(404).json("error");
});

app.listen(port, () => {
  console.log("server is working on 3000");
});
