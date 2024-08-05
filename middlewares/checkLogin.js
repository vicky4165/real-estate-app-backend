const checkLogin = (req, res, next, routeFor) => {
  if (routeFor === "admin") {
    if (!req.session.user || !req.session.isAdminLogin) {
      return res.redirect(`/login`);
    }
  }
  next();
};

module.exports = (routeFor) => (req, res, next) => checkLogin(req, res, next, routeFor);
