const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const { PythonShell } = require("python-shell");
const app = express();

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* user open the page */
// index
app.get("/", (req, res) => {
  res.render(`index/index`);
});

// login form
app.get("/login", (req, res) => {
  res.render(`login/index`);
});

// seller's form
app.get("/buy", (req, res) => {
  res.render(`buy/index`);
});

// write to RFID form
app.get("/write", (req, res) => {
  res.render(`write/index`);
});

// write to RFID form
app.get("/read", (req, res) => {
  res.render(`read/index`);
});

/* server side processes */
// user sign in process
app.post("/login", (req, res) => {
  const { username, password } = req.body;
});

// buy process
app.post("/buy", (req, res) => {});

// write to RFID
app.post("/write", (req, res) => {
  const cmd = require("node-cmd");
  // prettier-ignore
  cmd.get(`python3 src/py/write.py ${req.body.level} ${req.body.nis} ${req.body.money}`, (data, err, stderr) => {
    if (!err) res.render("write/failed", { error: err });
    else res.render("write/success");
  });
});

// read RFID data
app.post("/read", (req, res) => {
  let data;
  const py = new PythonShell("./src/py/read.py");
  py.on("message", function(m) {
    data = m;
  });
  py.end(err => {
    if (err) res.render("error", { error: err });
    res.render("read/output", { output: JSON.parse(data.replace(/'/g, '"')) });
  });
});

app.listen(3000, "172.16.7.53", console.log("3000"));
