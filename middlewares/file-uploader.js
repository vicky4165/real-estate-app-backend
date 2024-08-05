const multer = require("multer");
const path = require("path");

const productImageStorage = multer.diskStorage({
  destination: "./public/uploads/products/",
  filename: (req, file, cb) => {
    console.log("-------------------------");
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const checkIsImg = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed...!"));
  }
};

exports.productImage = multer({ storage: productImageStorage });
