var express = require("express");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var router = express.Router();
const { validationResult } = require("express-validator");
const conn = require("../dbConnection").promise();
const nodemailer = require("nodemailer");
const main = require("../middleware/mail");

function forgotpass(email, token) {
  var email = email;
  var token = token;
  var mail = nodemailer.createTransport({
    service: "smtp.gmail.com",
    auth: {
      user: "helloworldsout333@gmail.com",
      pass: "Power@123",
    },
  });
  var forgotpass = {
    from: "helloworldsout333@gmail.com",
    to: email,
    subject: "Reset Password Link",
    html:
      '<p>You requested for reset password, kindly use this <a href="http://localhost:3000/reset-password?token=' +
      token +
      '">link</a> to reset your password</p>',
  };
  mail.forgotpass(mailOptions, function (error, info) {
    if (error) {
      console.log(1);
    } else {
      console.log(0);
    }
  });
}
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Forget Password Page",
  });
});

router.get("/reset_password", function (req, res, next) {
  res.render("reset-password", {
    title: "Reset Password Page",
    token: req.query.token,
  });
});

exports.resetPasswordMail = async (req, res) => {
  var email = req.body.email;
  console.log("reset password email", email);
  const [row] = await conn.execute("SELECT * FROM `users` WHERE `email`=?", [
    email,
  ]);
  console.log("user data", row[0]);
  conn.query(
    'SELECT * FROM users WHERE email ="' + email + '"',
    function (err, result) {
      if (err) throw err;
      if (result) {
        console.log("", result);
      }
    }
  );
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
};

// router.post("/update_password", function (req, res, next) {
//   var token = req.body.token;
//   var password = req.body.password;
//   conn.query(
//     'SELECT * FROM users WHERE token ="' + token + '"',
//     function (err, result) {
//       if (err) throw err;
//       var type;
//       var msg;
//       if (result.length > 0) {
//         var saltRounds = 10;

//         bcrypt.genSalt(saltRounds, function (err, salt) {
//           bcrypt.hash(password, salt, function (err, hash) {
//             var data = {
//               password: hash,
//             };
//             conn.query(
//               'UPDATE users SET ? WHERE email ="' + result[0].email + '"',
//               data,
//               function (err, result) {
//                 if (err) throw err;
//               }
//             );
//           });
//         });
//         type = "success";
//         msg = "Your password has been updated successfully !!!!";
//       } else {
//         console.log("2");
//         type = "success";
//         msg = "Invalid link please try again .....";
//       }
//       req.flash(type, msg);
//       res.redirect("/");
//     }
//   );
// });
// module.exports = router;
