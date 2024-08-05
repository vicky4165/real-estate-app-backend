require("dotenv").config();
const express = require("express");
const compression = require("compression");
const app = express();
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const path = require("path");
const { DB_CONNECT, SECRET, APP_SID } = process.env;
const MemoryStore = session.MemoryStore;

//DATABASE CONNECTIONS STARTS
mongoose.connect(DB_CONNECT);
let db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("disconnected", () => console.log("Disonnected to MongoDB"));
db.on("reconnected", () => console.log("Reconnected to MongoDB"));
db.on("error", (err) => console.log(err));
//DATABASE CONNECTIONS ENDS

// SETTING EJS VIEW ENGINE
app.set("view engine", "ejs");

app.use(cookieParser());
app.use(cors());
app.use(compression());
app.use(session({ name: APP_SID, secret: SECRET, resave: true, store: new MemoryStore(), saveUninitialized: true, }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//route defines here
app.use("/", require("./web/routes/admin.routes"));

app.get("/logout", async (req, res) => {
  const sess = req.session;
  sess.isAdminLogin = false;
  sess.token = "";
  sess.user = "";
  res.redirect("/");
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log("ERR-404: ", error.message);
  // res.json({ message: error.message });
  res.render("404", { message: error.message });
});

module.exports = app;
