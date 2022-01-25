var express = require("express");
var router = express.Router();
const { body } = require("express-validator");
const auth = require("./middleware/auth");
const { register } = require("./controllers/registerController");
const { login } = require("./controllers/loginController");
const { verifymail } = require("./controllers/registerController");
const { getUser } = require("./controllers/getUserController");
const { resetPasswordMail } = require("./controllers/resetforgotpass");
const { reset_password } = require("./controllers/resetforgotpass");
const { update_password } = require("./controllers/resetforgotpass");
const { conn } = require("./dbConnection");
const { resetforgotpass } = require("./controllers/resetforgotpass");
const { verify } = require("jsonwebtoken");

var token = token;
router.post(
  "/register",
  [
    body("name", "The name must be of minimum 3 characters length")
      .notEmpty()
      .escape()
      .trim()
      .isLength({ min: 3 }),
    body("email", "Invalid email address").notEmpty().escape().trim().isEmail(),
    body("password", "The Password must be of minimum 4 characters length")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  register
);

router.post(
  "/login",
  [
    body("email", "Invalid email address").notEmpty().escape().trim().isEmail(),
    body("password", "The Password must be of minimum 4 characters length")
      .notEmpty()
      .trim()
      .isLength({ min: 4 }),
  ],
  login
);

router.get("/register", register);
router.get("/verifymail/:token", verifymail);
router.get("/getuser", auth, getUser);
router.post("/resetPasswordMail", resetPasswordMail);

/* router.post("/resetPasswordMail", function (req, res, next) {
  console.log("reset password email", email);
  var email = req.body.email;
  console.log(forgotpass(email, fullUrl));
  conn.query(
    'SELECT * FROM users WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;
      var type = "";
      var msg = "";
      console.log(result[0]);
      const url = `http://localhost:3000/resetPasswordMail/${token}`;
      let mailText = "you request for email verification please";
      main(req.body.email, url, mailText);
      if (result[0].email.length > 0) {
        var token = jwt.verify(req.params.token, "secret");
        var sent = forgotpass(email, token);
        if (sent != "0") {
          var data = {
            token: token,
          };
          conn.query(
            'UPDATE users SET ? WHERE email ="' + email + '"',
            data,
            function (err, result) {
              if (err) throw err;
            }
          );
          type = "success";
          msg = "The reset password link has been sent to your email address";
        } else {
          type = "error";
          msg = "Something goes to wrong. Please try again";
        }
      } else {
        type = "error";
        msg = "The Email is not registered with us";
      }
      req.flash(type, msg);
      res.redirect("/");
    }
  );
});
 */
module.exports = router;
