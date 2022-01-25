var express = require("express");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var router = express.Router();
const { validationResult } = require("express-validator");
const conn = require("../dbConnection").promise();
const main = require("../middleware/mail");

exports.verifymail = async (req, res) => {
  var user = jwt.verify(req.params.token, "secret");
  const [row] = await conn.execute("SELECT * FROM `users` WHERE `email`=?", [
    user.email,
  ]);
  if (row.length < 0) {
    return res.status(201).json({
      message: "The E-mail Does not exit please register",
    });
  } else if (row[0].is_verify === "true") {
    return res.status(201).json({
      message: "The E-mail Already verify please login !",
    });
  } else {
    conn.query("UPDATE users SET is_verify = ? WHERE email = ?", [
      "true",
      user.email,
    ]);
    return res.status(201).json({
      message: "The E-mail is verify please login Now!",
    });
  }
};

exports.register = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const [row] = await conn.execute(
      "SELECT `email` FROM `users` WHERE `email`=?",
      [req.body.email]
    );

    if (row.length > 0) {
      return res.status(201).json({
        message: "The E-mail already in use",
      });
    }

    const hashPass = await bcrypt.hash(req.body.password, 12);
    var token = jwt.sign({ email: req.body.email }, "secret", {});
    const [rows] = await conn.execute(
      "INSERT INTO `users`(`name`,`email`,`password`,`updatedAt`,`createdAt`,`is_verify`,`token`) VALUES(?,?,?,?,?,?,?)",
      [
        req.body.name,
        req.body.email,
        hashPass,
        req.body.updatedAt,
        req.body.createdAt,
        req.body.is_verify,
        token,
      ]
    );
    const url = `http://localhost:3000/verifymail/${token}`;
    let mailText = "you request for email verification please";
    main(req.body.email, url, mailText);
    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: "The user has been successfully inserted !!!!.",
        token: token,
      });
    }
  } catch (err) {}
};
