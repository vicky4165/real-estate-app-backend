const router = require("express").Router();
const trim = require("../../middlewares/trim");
const checkLogin = require("../../middlewares/checkLogin");
const { admin } = require("../../middlewares/validator");
const { productImage } = require("../../middlewares/file-uploader");
const Controller = require("../controllers/admin.controller");

router.get("/", checkLogin("admin"), Controller.getDashboardPage);
router.get("/login", Controller.getAdminLoginPage);
router.get("/setup-admin", Controller.setupAdminUser);

router.post("/login", trim, admin("login"), Controller.userLoginMethod);

module.exports = router;
