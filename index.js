var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var fs = require("fs");
var multer = require("multer");
require("dotenv").config();
app.use(bodyParser.json());
const cors = require("cors");
app.use(cors({ origin: "*" }));
const db = require("./db/db");
const path = require("path");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./pdf");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
app.use(function (req, res, next) {
  next();
});
app.post("/upload", upload.single("photo"), (req, res) => {
  if (req.file) {
    res.json(req.file);
  } else throw "error";
});
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
app.use(upload.array());
fs.readdirSync("routes").forEach(function (file) {
  if (file[0] == ".") return;
  var routeName = file.substr(0, file.indexOf("."));
  require("./routes/" + routeName)(app);
});

app.listen(7301, () => {
  console.log("server start ");
});

