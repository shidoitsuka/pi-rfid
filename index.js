const express = require("express");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const path = require("path");
const { PythonShell } = require("python-shell");
const app = express();
const Enmap = require("enmap");
const db = new Enmap({ name: "data" });
const { port } = require("./config.js");

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "hbs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* user open the page */
// index
app.get("/", (req, res) => {
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";
  if (seller == "undefined") return res.render(`login/index`);
  res.render("index/index");
});

// login form
app.get("/login", (req, res) => {
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";
  if (seller == "undefined") return res.render(`login/index`);
  res.render("index/index", {
    toast: true,
    message: "Silahkan logout terlebih dahulu."
  });
});

// Signup form
app.get("/signup", (req, res) => {
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";
  // check if "user" is not defined
  if (seller == "undefined") return res.render(`signup/index`);
  // if defined, show message to logout
  res.render("index/index", {
    toast: true,
    message: "Silahkan logout terlebih dahulu."
  });
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

// write to RFID form
app.get("/master", (req, res) => {
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";

  if (seller == "undefined") return res.render(`login/index`);
  const barang = db.get(seller, "barang");
  res.render(`master/index`, { seller, barang });
});

// write to RFID form
app.get("/sell", (req, res) => {
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";

  if (seller == "undefined") return res.render(`login/index`);
  const barang = db.get(seller, "barang");
  res.render(`sell/index`, { seller, barang });
});

// user sign out process
app.get("/logout", (req, res) => {
  // re defined "user" in cookie as undefined
  res.cookie("user");
  // redirect to login form
  res.redirect("/login");
});

// DUMP
app.get("/e", (req, res) => {
  // let x = db.get("brian").barang.map((item) => {
  //   return item.itemName;
  // });
  // console.log(db.get("brian"));
  let a = db.get("brian", "barang");
  let b = Object.keys(a);
  b.forEach((item, i) => {
    console.log(db.get("brian", `barang.${item}`));
  });
  res.end();
});
// !DUMP

/* server side processes
 * all post methods are stored bellow.
 */
// user sign in process
app.post("/login", (req, res) => {
  // get username and password
  const { username, password } = req.body;
  // check if username doesn't exists or username and password doesn't match
  if (!db.has(username) || db.get(username, "password") != password) {
    // render login form and show notice
    // prettier-ignore
    res.render("login/index", { toast: true, message: "User tidak ada atau sandi salah!", class: "fail" });
  } else {
    // if it matched set "user" cookie to username
    res.cookie("user", username);
    // render index
    res.render("index/index");
  }
});

// user sign up process
app.post("/signup", (req, res) => {
  // get username and password
  const { username, password } = req.body;
  // check if username doesn't exists in db
  if (!db.has(username)) {
    // set a new username and password
    db.set(username, { password: password, totalBarang: 0, barang: {} });
    // re-render sign up and notify user
    // prettier-ignore
    res.render(`signup/index`, { toast: true, message: "Berhasil!", class: "success" });
  } else {
    // if existed, notify user
    // prettier-ignore
    res.render(`signup/index`, { toast: true, message: "Sudah Terdaftar!", class: "fail" });
  }
});

// buy process
app.post("/buy", (req, res) => {});

// write to RFID
app.post("/write", (req, res) => {
  const cmd = require("node-cmd");
  // our data
  const { level, nis, money } = req.body;
  // run write.py script
  // prettier-ignore
  cmd.get(`python3 src/py/write.py ${level} ${nis} ${money}`, (data, err, stderr) => {
      // if its NOT error, render failed with error code
      if (!err) res.render("write/failed", { error: err });
      // if its error, render success (idk whats going on)
      else res.render("write/success");
    });
});

// read RFID data
app.post("/read", (req, res) => {
  // temp variable
  let data;
  // get read.py
  const py = new PythonShell("./src/py/read.py");
  // check incoming output from python
  py.on("message", function(m) {
    // store it in data
    data = m;
  });
  // do this when python has finished its job
  py.end(err => {
    // if error, render error with error data
    if (err) res.render("error", { error: err });
    // else, render card data
    // prettier-ignore
    else res.render("read/output", { output: JSON.parse(data.replace(/'/g, '"')) });
  });
});

// add item to DB
app.post("/addItem", (req, res) => {
  const { itemName, itemPrice } = req.body;
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";
  // prettier-ignore
  db.set(seller, { id: db.get(seller, "totalBarang"), name: itemName, price: itemPrice }, `barang.${itemName}`);
  db.inc(seller, "totalBarang");
  res.redirect("/master");
});

// edit item info
app.post("/editPrice", (req, res) => {
  // get form data
  const { selectedItem, newPrice } = req.body;
  const itemName = selectedItem.split("-")[0];
  // parse cookies & get value of "user"
  // prettier-ignore
  const seller = (req.headers.cookie != "" && req.headers.cookie != undefined) ? req.headers.cookie.split("; ")[0].split("=")[1] : "undefined";
  db.set(seller, newPrice, `barang.${itemName}.price`);
  res.redirect("/master");
});

app.listen(3000, port, console.log("3000"));
