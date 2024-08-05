const { check } = require("express-validator");

exports.admin = (method) => {
  switch (method) {
    case "login": {
      return [
        check("email", "Invalid email").isEmail(),
        check("password", "Password is required").not().isEmpty(),
      ];
    }
    default: {
      return [];
    }
  }
};