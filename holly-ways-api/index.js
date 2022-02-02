const express = require("express");
const path = require("path");

const cors = require('cors');

const router = require("./src/routes");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api/v1/", router);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});