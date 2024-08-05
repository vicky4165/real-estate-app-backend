const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ADMIN_EMAIL, JWT_KEY, BASE_URL } = process.env;
const User = require("../../models/user.model");

exports.setupAdminUser = async (req, res) => {
  let msg = "";
  try {
    const dbAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (dbAdmin) {
      msg = "Admin created already, please login with admin credentials.";
    } else {
      const passGen = await bcrypt.hash("123456", 10);
      const newAdminUser = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Real Estate Admin",
        usertype: "admin",
        email: ADMIN_EMAIL,
        password: passGen,
      });
      await newAdminUser.save();
      msg = "Admin created. login with admin credentials.";
    }
    res.render("admin/login", { err: true, msg, title: "Login" });
  } catch (e) {
    res.render("admin/login", { err: true, msg: e.message, title: "Login" });
  }
};

exports.userLoginMethod = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let errs = [];
      let err_msgs = { ...errors };
      err_msgs.errors.forEach((err) => errs.push(err.msg));
      return res.status(200).json({ status: false, msg: errs, data: {} });
    }
    const { email, password } = req.body;
    const dbAdmin = await User.findOne({ email });
    if (!dbAdmin)return res.status(200).json({ status: false, msg: "Not Admin User", data: {} });
    if (dbAdmin.usertype !== "admin") return res.status(200).json({ status: false, msg: "Invalid Admin Email ID.", data: {} });
    const comparePassword = await bcrypt.compare(password, dbAdmin.password);
    if (!comparePassword) return res.status(200).json({ status: false, msg: "Incorrect Password.", data: {} });
    const user = { ...dbAdmin._doc, password: null };
    const token = jwt.sign({ email, userId: user._id }, JWT_KEY, { expiresIn: "12h" });
    let sess = req.session;
    sess.user = user;
    sess.token = token;
    sess.isAdminLogin = true;
    return res.status(200).json({ status: true, msg: "Logged In Successfully.", data: user });
  } catch (e) {
    return res.status(200).json({ status: false, msg: e.message, data: {} });
  }
};

exports.getDashboardPage = async (req, res) => {
  const sess = req.session;
  res.render("admin/index", {
    err: "",
    msg: "",
    title: "Dashboard",
    user: sess.user
  });
};

exports.getAdminLoginPage = async (req, res) => res.render("admin/login", { err: "", msg: "", title: "Login" });
