const path = require("path");

const express = require("express");
const dotEnv = require("dotenv");

const routes = require("./route");

const app = express();
dotEnv.config();
app.use(express.json());

app.use(routes);

app.use((req, res, next) => {
  res.status(404).json({
    code: 404,
    message: "Route Not Found!",
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    code: error.statusCode || 500,
    message: error.message || "Internal Server Error",
  });
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
