const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"] ||
      req.headers["Authorization"];

    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });
    jwt.verify(token, "secret", (err, user) => {
      if (err) return res.status(400).json({ msg: "Invalid Authentication." });
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
module.exports = auth;
